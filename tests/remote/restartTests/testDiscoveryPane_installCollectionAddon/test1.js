/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// Include required modules
var addons = require("../../../../lib/addons");
var modalDialog = require("../../../../lib/modal-dialog");
var tabs = require("../../../../lib/tabs");

const TIMEOUT_DOWNLOAD = 25000;
const INSTALL_SOURCE = "discovery-promo";

function setupModule() {
  controller = mozmill.getBrowserController();
  am = new addons.AddonsManager(controller);

  tabs.closeAllTabs(controller);
}

function teardownModule() {
  am.close();
}

/**
 * Verifies installation of an add-on from the Collections pane
 */
function testInstallCollectionAddon() {
  am.open();

  // Select the Get Add-ons pane
  am.setCategory({category: am.getCategoryById({id: "discover"})});

  var discovery = am.discoveryPane;
  discovery.waitForPageLoad();
  
  // Go to Collections pane
  var section = discovery.getSection("main-feature");
  var nextLink = discovery.getElement({type: "mainFeature_nextLink", parent: section});
  
  controller.click(nextLink);
  discovery.waitForPageLoad();
 
  // Click on a random addon  
  var addonList = discovery.getElements({type: "mainFeature_collectionAddons", 
                                       parent: section});
  var randomIndex = Math.floor(Math.random() * addonList.length);
  var randomAddon = addonList[randomIndex];
  var addonId = randomAddon.getNode().getAttribute("data-guid");
 
  controller.click(randomAddon);
  discovery.waitForPageLoad(TIMEOUT_DOWNLOAD);  

  // Install the addon 
  var addToFirefox = discovery.getElement({type: "addon_installButton"});
 
  // Retrieve addon src parameter from installation link
  var currentInstallSource = discovery.getInstallSource(addToFirefox);

  controller.assert(function () {
    return currentInstallSource === INSTALL_SOURCE;
  }, "Installation link has source set - got '" + currentInstallSource +
     "', expected '" + INSTALL_SOURCE + "'");

  var md = new modalDialog.modalDialog(am.controller.window);
  md.start(handleInstallAddonDialog);  
  controller.click(addToFirefox);

  md.waitForDialog(TIMEOUT_DOWNLOAD);

  // Verify the addon is installed
  am.setCategory({category: am.getCategoryById({id: "extension"})});
 
  var addon = am.getAddons({attribute: "value", value: addonId})[0];

  controller.assert(function() {
    return am.isAddonInstalled({addon: addon});
  }, "Add-on has been installed - got '" + 
     am.isAddonInstalled({addon: addon}) + "', expected 'true'"); 
}

/**
 * Handle the modal dialog to install an addon
 */
function handleInstallAddonDialog(controller) {
  // Wait for the install button is enabled before clicking on it
  var installButton = new elementslib.Lookup(controller.window.document, 
                                             '/id("xpinstallConfirm")' +
                                             '/anon({"anonid":"buttons"})' + 
                                             '/{"dlgtype":"accept"}');
  controller.waitFor(function(){
    return !installButton.getNode().disabled; 
  }, "Install button is enabled: got '" + !installButton.getNode().disabled + 
     "', expected 'true'");

  controller.click(installButton); 
}

// Bug 732353 - Disable all Discovery Pane tests 
//              due to unpredictable web dependencies
setupModule.__force_skip__ = "Bug 732353 - Disable all Discovery Pane tests " + 
                             "due to unpredictable web dependencies";
teardownModule.__force_skip__ = "Bug 732353 - Disable all Discovery Pane tests " + 
                                "due to unpredictable web dependencies";
