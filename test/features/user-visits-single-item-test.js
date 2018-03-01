const {assert} = require('chai');
const {buildItemObject} = require('../test-utils');

describe('User clicks item card', () => {
    describe('item detail page', () => {
      it('displays the item description', () => {
        const itemToCreate = buildItemObject();
        browser.url('/items/create');
        browser.setValue('#title-input', itemToCreate.title);
        browser.setValue('#description-input', itemToCreate.description);
        browser.setValue('#imageUrl-input', itemToCreate.imageUrl);
        browser.click('#submit-button');
        browser.click('.item-card a');
        assert.include(browser.getText('body'), itemToCreate.description);
        
      });
    });

    describe('update button', () => {
      it('takes you to the update page for this item', () => {
        const itemToCreate = buildItemObject();
        browser.url('/items/create');
        browser.setValue('#title-input', itemToCreate.title);
        browser.setValue('#description-input', itemToCreate.description);
        browser.setValue('#imageUrl-input', itemToCreate.imageUrl);
        browser.click('#submit-button');
        browser.click('.item-card a');
        browser.click('.update-button');
        assert.include(browser.getText('.create-column h2'), 'Update item');
      });
    })
});