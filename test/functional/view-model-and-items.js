import { Application } from 'spectron';
import electron from 'electron-prebuilt';
import { assert } from 'chai';
import MockServer from '../util/mock-server';
import models from '../test-cases/models';
import items from '../test-cases/items';

describe('Viewing a model and an item', function () {

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

    after(() => {
        if (app && app.isRunning()) {
            return app.stop().then(() => {
                return mockServer.stop();
            });
        }
    });

    beforeEach(() => {
        mockServer.clearExpectations();
    });

    it('Looks up a model and its items', () => {
        mockServer.expect({
            method: 'get',
            endpoint: 'model/children',
            qs: {
                modelAddress: 'm8y7nEtAe'
            },
            response: {
                status: 'success',
                data: {
                    model: models[0],
                    items: [items[0], items[1], items[3]]
                }
            }
        });
        return app.client.keys('m8y7nEtAe').then(() => {
            return app.client.waitForVisible('.model', 1000000);
        }).then(() => {
            return app.client.getText('.model .titleArea h2');
        }).then(name => {
            assert.strictEqual(name, 'Resistor');
            return app.client.elements('.item');
        }).then(elements => {
            assert.lengthOf(elements.value, 3);
        });
    });

});
