/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Mozilla Mozmill Test Code.
 *
 * The Initial Developer of the Original Code is Mozilla Corporation.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Aakash Desai <adesai@mozilla.com>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

var mozmill = {}; Components.utils.import('resource://mozmill/modules/mozmill.js', mozmill);
var elementslib = {}; Components.utils.import('resource://mozmill/modules/elementslib.js', elementslib);

var setupModule = function(module) {
  module.controller = mozmill.getBrowserController();
}

/**
 *  Waits until element exists before calling assertNode
 */
function delayedAssertNode(aNode, aTimeout) {
  controller.waitForElement(aNode, aTimeout);
  controller.assertNode(aNode);
}

/**
 *  Testcase ID #5988 - Stop and Reload buttons
 */
var testStopAndReload = function() {
  var elem = new elementslib.Link(controller.tabs.activeTab, "subscribe");

  // Go to the NYPost front page and start loading for some milli seconds
  controller.open("http://www.nypost.com/");
  controller.sleep(500);

  // Throbber on tab should immediately replaced by the favicon when hitting the stop button
  controller.click(new elementslib.ID(controller.window.document, "stop-button"));
  controller.assertNodeNotExist(elem);
  controller.sleep(1000);

  // Reload the web page and wait for it to completely load
  controller.refresh();
  delayedAssertNode(elem, 5000);
}
