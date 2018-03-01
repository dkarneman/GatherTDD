const {assert} = require('chai');
const {buildItemObject} = require('../test-utils');

describe('User visits root', () => {
  describe('without existing items', () => {
    it('starts blank', () => {
      browser.url('/');
      assert.equal(browser.getText('#items-container'), '');
    });
  });
  describe('can navigate', () => {
    it('to the create page', () => {
      // Setup
      browser.url('/');
      // Exercise
      browser.click('a[href="/items/create"]');
      // Verification
      assert.include(browser.getText('body'), 'Create');
    });
  });
  describe('clicks delete', () => {
    it('removes the deleted item from the view', () => {
      const itemToCreate = buildItemObject({title:'DeleteMe'});
      browser.url('/items/create');
      browser.setValue('#title-input', itemToCreate.title);
      browser.setValue('#description-input', itemToCreate.description);
      browser.setValue('#imageUrl-input', itemToCreate.imageUrl);
      browser.click('#submit-button');
      
      browser.submitForm(`.delete-form`);

      assert.notInclude(browser.getText('body'), itemToCreate.title);
    })
  })
});
