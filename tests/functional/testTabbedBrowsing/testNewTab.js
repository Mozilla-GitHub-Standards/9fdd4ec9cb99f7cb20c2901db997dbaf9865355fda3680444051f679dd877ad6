/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// Include required modules
var {expect} = require("../../../lib/assertions");
var prefs = require("../../../lib/prefs");
var tabs = require("../../../lib/tabs");
var utils = require("../../../lib/utils");

const LOCAL_TEST_FOLDER = collector.addHttpResource('../../../data/');
const LOCAL_TEST_PAGE = LOCAL_TEST_FOLDER + 'layout/mozilla.html';

const PREF_NEWTAB_URL = "browser.newtab.url";

function setupModule(module) {
  controller = mozmill.getBrowserController();

  tabBrowser = new tabs.tabBrowser(controller);
  tabBrowser.closeAllTabs();

  // Save old state
  oldTabsOnTop = tabBrowser.hasTabsOnTop;
}

function teardownModule(module) {
  tabBrowser.hasTabsOnTop = oldTabsOnTop;
}

function testNewTab() {
  controller.open(LOCAL_TEST_PAGE);
  controller.waitForPageLoad();

  // Ensure current tab does not have blank page loaded
  var section = new elementslib.ID(controller.tabs.activeTab, "organization");
  controller.waitForElement(section);

  // First, perform all tests with tabs on bottom
  tabBrowser.hasTabsOnTop = false;
  checkOpenTab("menu");
  checkOpenTab("shortcut");
  checkOpenTab("newTabButton");
  checkOpenTab("tabStrip");

  // Second, perform all tests with tabs on top
  tabBrowser.hasTabsOnTop = true;
  checkOpenTab("menu");
  checkOpenTab("shortcut");
  checkOpenTab("newTabButton");

  // NOTE: On Linux and beginning with Windows Vista a double click onto the
  //       tabstrip maximizes the window instead. So don't execute this test
  //       on those os versions.
  var sysInfo = Cc["@mozilla.org/system-info;1"].
                   getService(Ci.nsIPropertyBag2);
  var version = sysInfo.getProperty("version");

  if (mozmill.isMac || (mozmill.isWindows && (version < "6.0"))) {
   checkOpenTab("tabStrip");
  }
}

/**
 * Check if a new tab has been opened, has a title and can be closed
 *
 * @param {String} aEventType Type of event which triggers the action
 */
function checkOpenTab(aEventType) {
  // Open a new tab and check that 'about:newtab' has been opened
  tabBrowser.openTab(aEventType);

  // XXX: Remove this line when Bug 716108 lands
  controller.waitForPageLoad();

  var newTabURL = prefs.preferences.getPref(PREF_NEWTAB_URL, '');

  expect.equal(tabBrowser.length, 2, "Two tabs visible - opened via " + aEventType);
  expect.equal(controller.tabs.activeTab.location.href, newTabURL,
               "Opened new tab");

  // The tabs title should be 'New Tab'
  var title = utils.getProperty("chrome://browser/locale/tabbrowser.properties",
                                "tabs.emptyTabTitle");

  expect.equal(tabBrowser.getTab().getNode().label, title, "Correct tab title");

  // Close the tab again
  tabBrowser.closeTab();
}

/**
 * Map test functions to litmus tests
 */
// testNewTab.meta = {litmusids : [8086]};
