const {assert} = require('chai');
const request = require('supertest');
const {jsdom} = require('jsdom');

const app = require('../../app');
const Item = require('../../models/item');

const {parseTextFromHTML, seedItemToDatabase, findImageElementBySource,findElementByID} = require('../test-utils');
const {connectDatabaseAndDropData, diconnectDatabase} = require('../setup-teardown-utils');

describe('Server path: /items/:itemId/update', () => {

  beforeEach(connectDatabaseAndDropData);

  afterEach(diconnectDatabase);

  describe('GET', () => {
    it('renders the item title, description, and image', async () => {
      const item = await seedItemToDatabase();
      const response = await request(app)
        .get(`/items/${item._id}/update`);
      const formTitle = findElementByID(response.text, 'input','title-input');
      const formDescription = findElementByID(response.text,'textarea','description-input');
      const imageElement = findImageElementBySource(response.text, item.imageUrl);

      assert.equal(formTitle.value, item.title);
      assert.equal(formDescription.value, item.description);
      assert.equal(imageElement.src, item.imageUrl);
    });
  });

  describe('POST', () => {
    it('saves the item with a new title, description and url', async () => {
        const item = await seedItemToDatabase();
        const modifier = {title:'AlteredTitle',
            description:'AlteredDescription',
            imageUrl:'http://placebear.com/g/300/400'};
        const response = await request(app)
            .post(`/items/${item._id}/update`)
            .type('form')
            .send(modifier);

        const alteredItem = await Item.findById(item._id);
        assert.isOk(alteredItem, 'Item was not successfully modified by update');
        assert.equal(alteredItem.title, modifier.title);
        assert.equal(alteredItem.description, modifier.description);
        assert.equal(alteredItem.imageUrl, modifier.imageUrl);

    });

    it('redirects to the item detail page', async () => {
        const item = await seedItemToDatabase();
        const modifier = {title:'AlteredTitle',
            description:'AlteredDescription',
            imageUrl:'http://placebear.com/g/300/400'};
        const response = await request(app)
            .post(`/items/${item._id}/update`)
            .type('form')
            .send(modifier);
        assert.equal(response.status, 302);
        assert.equal(response.headers.location, `/items/${item._id}`);
    });

    it('displays an error message upon failure',async () => {
        const item = await seedItemToDatabase();
        const modifier = {title:'',
            description:'AlteredDescription',
            imageUrl:'http://placebear.com/g/300/400'};
        const response = await request(app)
            .post(`/items/${item._id}/update`)
            .type('form')
            .send(modifier);

        assert.equal(response.status, 400);
        assert.include(parseTextFromHTML(response.text, 'form'), 'required');
    });
  });
  });