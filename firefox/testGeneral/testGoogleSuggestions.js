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
 * The Original Code is Mozmill Test Code.
 *
 * The Initial Developer of the Original Code is Mozilla Foundation.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Aakash Desai <adesai@mozilla.com>
 *   Henrik Skupin <hskupin@mozilla.com>
 *   Mark Locklear <marklocklear@gmail.com>
 *   Aaron Train <atrain@mozilla.com>
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

// Include required modules
var DOMUtils = require("../../shared-modules/dom-utils");

const TIMEOUT = 5000;

var setupModule = function() {
  controller = mozmill.getBrowserController();
}

var testGoogleSuggestedTerms = function() {
  // Switch to Google SSL Beta for lack of Google Instant search
  controller.open("https://encrypted.google.com/");
  controller.waitForPageLoad();

  // Enter a search term into the Google search field
  var searchField = new elementslib.Name(controller.tabs.activeTab, "q");
  controller.type(searchField, "area");

  // Get a reference to first element of the autocomplete results
  collector = new DOMUtils.nodeCollector(controller.tabs.activeTab);
  controller.waitFor(function () {
    collector.queryNodes(".gac_m .gac_c");
    return collector.elements.length > 0;
  }, "Auto-complete entries are visible - got ' + collector.elements.length + '");

  // Remember the value and click the element
  var entry = collector.elements[0];
  var content = entry.getNode().textContent;

  controller.waitThenClick(entry, TIMEOUT);
  controller.waitForPageLoad();

  // Check if Search page has come up
  var nextField = new elementslib.ID(controller.tabs.activeTab, "pnnext");
  controller.waitForElement(nextField, TIMEOUT);

  searchField = new elementslib.Name(controller.tabs.activeTab, "q");
  controller.assertValue(searchField, content);
}

/**
 * Map test functions to litmus tests
 */
// testGoogleSuggestedTerms.meta = {litmusids : [8083]};
