'use strict';

// Angular E2E Testing Guide:
// https://docs.angularjs.org/guide/e2e-testing

describe('DateTimePicker Test Application', function() {
  beforeEach(function() {
    browser.get('index.html');
  });

  it('should allow user to type in a date from the input', function() {
    var dateInput = element(by.model('date'));
    dateInput.clear();  // Clear current date input.
    dateInput.sendKeys('07/1/2016 8:11 PM');
    dateInput.sendKeys(protractor.Key.TAB);  // Makes sure the element loses focus.

    expect(element(by.binding('date')).getText()).toEqual('7/1/16 8:11 PM');
  });
});
