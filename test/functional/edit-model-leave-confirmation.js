import { Application } from 'spectron';
import electron from 'electron-prebuilt';
import { assert } from 'chai';
import MockServer from '../util/mock-server';
import items from '../test-cases/items';
import models from '../test-cases/models';

describe('Edit model leave confirmation', function () {

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

    it('navigates to the edit model page', () => {
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

        mockServer.expect({
            method: 'get',
            endpoint: 'model',
            qs: {
                address: models[0].address
            },
            response: {
                status: "success",
                data: models[0]
            }
        });
        return app.client.click('#view-models').then(() => {
            return app.client.waitForVisible('#models', 5000);
        }).then(() => {
            return app.client.click('.actionArea img[src="../assets/images/edit.svg"]')
        }).then(() => {
            return app.client.waitForVisible(".create-model-form", 5000);
        }).then(() => {
            mockServer.validate();
        });
    });

    it('warns you before leaving the page', () => {
        return app.client.click('.create-model-form>button').then(() => {
            return app.client.waitForVisible('.modal');
        }).then(() => {
            return app.client.click('.modal-content button');
        }).then(() => {
            return app.client.waitForVisible('.create-model-form');
        }).then(() => {
            return app.client.click('#omnibar img');
        }).then(() => {
            return app.client.waitForVisible('.modal');
        }).then(() => {
            return app.client.click('.modal-content button');
        }).then(() => {
            return app.client.waitForVisible('.create-model-form');
        }).then(() => {
            return app.client.click('#omnibar img');
        }).then(() => {
            return app.client.waitForVisible('.modal');
        }).then(() => {
            return app.client.click('.modal-content button[type="button"]');
        }).then(() => {
            return app.client.waitForVisible('.create-model-form', 1000, true);
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
