import { Application } from 'spectron';
import electron from 'electron-prebuilt';
import { assert } from 'chai';
import MockServer from '../util/mock-server';
import items from '../test-cases/items';
import models from '../test-cases/models';

describe('Deleting an Item', function () {

    this.timeout(10000);
    let app;
    let mockServer = new MockServer();

    before(() => {
        app = new Application({
            path: electron,
            args: ['index.js', '--port=8080']
        });
        return app.start().then(() => {
            return mockServer.start(8080);
        });
    });

    beforeEach(() => {
        mockServer.clearExpectations();
    });

    it('deletes an item', () => {
        mockServer.expect({
            method: 'get',
            endpoint: 'item/all',
            response: {
                status: 'success',
                data: {
                    items
                }
            }
        });
        mockServer.expect({
            method: 'get',
            endpoint: 'model/all',
            response: {
                status: 'success',
                data: {
                    models
                }
            }
        });
        items.splice(0, 1);
        mockServer.expect({
            method: 'delete',
            endpoint: 'item',
            qs: {
                itemAddress: 'iGwEZUvfA',
                modelAddress: 'm8y7nEtAe'
            },
            response: {
                status: 'success',
                data: {
                    modelName: 'Resistor',
                    items
                }
            }
        });
        return app.client.click('#view-items').then(() => {
            return app.client.waitForVisible('#items', 5000);
        }).then(() => {
            return app.client.elements('#items .item');
        }).then(elements => {
            assert.lengthOf(elements.value, 2);
            return app.client.click('.item:nth-of-type(1) .actionArea img[src*="delete"]');
        }).then(() => {
            return app.client.waitForVisible('.toast', 5000);
        }).then(() => {
            return app.client.getText('.toast');
        }).then(text => {
            assert.strictEqual(text, 'An item was deleted: Resistor (iGwEZUvfA)');
            return app.client.click('.toast');
        }).then(() => {
            return app.client.waitForVisible('.toast', 5000, true);
        }).then(() => {
            return app.client.elements('#items .item');
        }).then(elements => {
            assert.lengthOf(elements.value, 1);
            mockServer.validate();
        });
    });

    after(() => {
        if (app && app.isRunning()) {
            return app.stop().then(() => {
                return mockServer.stop();
            });
        }
    });

});
