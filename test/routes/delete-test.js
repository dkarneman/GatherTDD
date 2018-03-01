const {assert} = require('chai');
const request = require('supertest');
const {jsdom} = require('jsdom');

const app = require('../../app');
const Item = require('../../models/item');

const {parseTextFromHTML, seedItemToDatabase, findImageElementBySource} = require('../test-utils');
const {connectDatabaseAndDropData, diconnectDatabase} = require('../setup-teardown-utils');

describe('Server path: /', () => {

  beforeEach(connectDatabaseAndDropData);

  afterEach(diconnectDatabase);

  describe('items/itemId/delete', () => {
    it('redirects home', async () => {
        const item = await seedItemToDatabase();
        const response = await request(app)
        .post(`/items/${item._id}/delete`)
        .type('form')
        .send();

        assert.equal(response.status, 302);
        assert.equal(response.headers.location, '/');
    });

    it('deletes one item', async () => {
        const firstItem = await seedItemToDatabase({title: 'Item1'});
        const secondItem = await seedItemToDatabase({title: 'Item2'});
        const beforeItems = await Item.find({})

        const response = await request(app)
        .post(`/items/${firstItem._id}/delete`)
        .type('form')
        .send();
        const afterItems = await Item.find({})
        
        assert.equal(beforeItems.length, 2);
        assert.equal(afterItems.length, 1);
    });
  });
});