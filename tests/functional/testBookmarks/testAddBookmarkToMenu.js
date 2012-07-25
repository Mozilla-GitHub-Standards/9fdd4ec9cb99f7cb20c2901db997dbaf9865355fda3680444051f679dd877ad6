/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// Include required modules
var { expect } = require("../../../lib/assertions");
var places = require("../../../lib/places");
var utils = require("../../../lib/utils");

const LOCAL_TEST_FOLDER = collector.addHttpResource('../../../data/');
const LOCAL_TEST_PAGE = LOCAL_TEST_FOLDER + 'layout/mozilla_contribute.html';

var setupModule = function() {
  controller = mozmill.getBrowserController();
}

var teardownModule = function() {
  places.restoreDefaultBookmarks();
}

var testAddBookmarkToBookmarksMenu = function() {
  var uri = utils.createURI(LOCAL_TEST_PAGE);

  // Open URI and wait until it has been finished loading
  controller.open(uri.spec);
  controller.waitForPageLoad();

  // Open the bookmark panel via bookmarks menu
  controller.mainMenu.click("#menu_bookmarkThisPage");

  // editBookmarksPanel is loaded lazily. Wait until overlay for StarUI has been loaded
  controller.waitFor(function () {
    return controller.window.top.StarUI._overlayLoaded;
  }, "Edit This Bookmark doorhanger has been loaded");

  // Bookmark should automatically be stored under the Bookmark Menu
  var nameField = new elementslib.ID(controller.window.document, 
                                     "editBMPanel_namePicker");
  var doneButton = new elementslib.ID(controller.window.document, 
                                      "editBookmarkPanelDoneButton");

  controller.type(nameField, "Mozilla");
  controller.click(doneButton);

  // XXX: Until we can't check via a menu click, call the Places API function for now (bug 474486)
  var bookmarkFolder = places.bookmarksService.bookmarksMenuFolder;
  var bookmarkExists = places.isBookmarkInFolder(uri, bookmarkFolder);
  expect.ok(bookmarkExists, "Bookmark was created in the bookmarks menu");
}

/**
 * Map test functions to litmus tests
 */
// testAddBookmarkToBookmarksMenu.meta = {litmusids : [8154]};
