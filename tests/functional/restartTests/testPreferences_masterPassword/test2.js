/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// Include required modules
var modalDialog = require("../../../../lib/modal-dialog");
var prefs = require("../../../../lib/prefs");
var utils = require("../../../../lib/utils");


var setupModule = function(module) {
  controller = mozmill.getBrowserController();
}

/**
 * Test invoking master password dialog when opening password manager
 */
var testInvokeMasterPassword = function() {
  // Call preferences dialog and invoke master password functionality
  prefs.openPreferencesDialog(controller, prefDialogInvokeMasterPasswordCallback);
}

/**
 * Bring up the master password dialog via the preferences window
 * @param {MozMillController} controller
 *        MozMillController of the window to operate on
 */
var prefDialogInvokeMasterPasswordCallback = function(controller) {
  var prefDialog = new prefs.preferencesDialog(controller);

  prefDialog.paneId = 'paneSecurity';

  var showPasswordButton = new elementslib.ID(controller.window.document, "showPasswords");
  controller.waitForElement(showPasswordButton);

  // Call showPasswords dialog and view the passwords on your profile
  var md = new modalDialog.modalDialog(controller.window);
  md.start(checkMasterHandler);

  controller.click(showPasswordButton);
  md.waitForDialog();

  // Check if the password manager has been opened
  utils.handleWindow("type", "Toolkit:PasswordManager", checkPasswordManager);

  prefDialog.close(true);
}

/**
 * Check that the saved passwords are shown
 * @param {MozMillController} controller
 *        MozMillController of the window to operate on
 */
function checkPasswordManager(controller) {
  var togglePasswords = new elementslib.ID(controller.window.document, "togglePasswords");
  var passwordCol = new elementslib.ID(controller.window.document, "passwordCol");

  controller.waitForElement(togglePasswords);
  utils.assertElementVisible(controller, passwordCol, false);

  // Call showPasswords dialog and view the passwords on your profile
  var md = new modalDialog.modalDialog(controller.window);
  md.start(checkMasterHandler);

  controller.click(togglePasswords);
  md.waitForDialog();

  utils.assertElementVisible(controller, passwordCol, true);

  // Close the password manager
  var dtds = ["chrome://passwordmgr/locale/passwordManager.dtd"];
  var cmdKey = utils.getEntity(dtds, "windowClose.key");
  controller.keypress(null, cmdKey, {accelKey: true});
}

/**
 * Verify the master password dialog is invoked
 * @param {MozMillController} controller
 *        MozMillController of the window to operate on
 */
var checkMasterHandler = function(controller) {
  var passwordBox = new elementslib.ID(controller.window.document, "password1Textbox");

  controller.waitForElement(passwordBox);
  controller.type(passwordBox, "test1");

  var button = new elementslib.Lookup(controller.window.document,
                               '/id("commonDialog")/anon({"anonid":"buttons"})/{"dlgtype":"accept"}');
  controller.click(button);
}

// Bug 611455 - Disconnect error in restart test module testMasterPassword
//              Reported as a top-failure
setupModule.__force_skip__ = "Bug 611455: Disconnect error in restart test module testMasterPassword";