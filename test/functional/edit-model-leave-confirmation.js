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
            return app.client.click('.actionArea img[src*="edit"]');
        }).then(() => {
            return app.client.waitForVisible(".model-form", 5000);
        }).then(() => {
            mockServer.validate();
        });
    });

    it('does not warn you before leaving an unchanged model via "Back" button', () => {
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

        return app.client.click('.model-form #back-btn').then(() => {
            return app.client.waitForVisible('#models');
        }).then(() => {
            return app.client.click('.actionArea img[src*="edit"]');
        }).then(() => {
            return app.client.waitForVisible('.model-form');
        }).then(() => {
            mockServer.validate();
        });
    });

    it('does not warn you before leaving an unchanged model via Omnibar', () => {
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

        return app.client.click('#omnibar img').then(() => {
            return app.client.waitForVisible('#index');
        }).then(() => {
            return app.client.click('#view-models');
        }).then(() => {
            return app.client.waitForVisible('#models');
        }).then(() => {
            return app.client.click('.actionArea img[src*="edit"]');
        }).then(() => {
            return app.client.waitForVisible('.model-form');
        }).then(() => {
            mockServer.validate();
        });
    });

    it('warns you before leaving the page', () => {
        return app.client.click('#name input').then(() => {
            return app.client.keys('change');
        }).then(() => {
            return app.client.click('.model-form #back-btn')
        }).then(() => {
            return app.client.waitForVisible('.modal');
        }).then(() => {
            return app.client.click('.modal-buttons button:nth-of-type(2)');
        }).then(() => {
            return app.client.waitForVisible('.model-form');
        }).then(() => {
            return app.client.click('#omnibar img');
        }).then(() => {
            return app.client.waitForVisible('.modal');
        }).then(() => {
            return app.client.click('.modal-buttons button:nth-of-type(2)');
        }).then(() => {
            return app.client.waitForVisible('.model-form');
        }).then(() => {
            return app.client.click('#omnibar img');
        }).then(() => {
            return app.client.waitForVisible('.modal');
        }).then(() => {
            return app.client.click('.modal-buttons button');
        }).then(() => {
            return app.client.waitForVisible('.model-form', 1000, true);
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
