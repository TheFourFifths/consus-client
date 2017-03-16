import { Application } from 'spectron';
import electron from 'electron-prebuilt';
import { assert } from 'chai';
import MockServer from '../util/mock-server';
import items from '../test-cases/items';
import models from '../test-cases/models';

describe('Printing QR codes', function () {

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

    it('navigates to the models page', () => {
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
        return app.client.click('#view-models').then(() => {
            return app.client.waitForVisible('#models', 5000);
        }).then(() => {
            return app.client.elements('#models .model');
        }).then(elements => {
            assert.lengthOf(elements.value, 4);
            mockServer.validate();
        });
    });

    it('opens the page to print a model QR code', () => {
        return app.client.click('#models div:nth-of-type(1) .model img[src="../assets/images/qr.svg"]').then(() => {
            return app.client.waitForVisible('#printer');
        }).then(() => {
            return app.client.waitForVisible('#printer img');
        });
    });

    it('returns to the models page', () => {
        return app.client.click('#printer .cancel').then(() => {
            return app.client.waitForVisible('#models');
        });
    });

    it('returns to the home page', () => {
        return app.client.click('#omnibar img').then(() => {
            return app.client.waitForVisible('#index');
        });
    });

    it('navigates to the items page', () => {
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
        return app.client.click('#view-items').then(() => {
            return app.client.waitForVisible('#items', 5000);
        }).then(() => {
            mockServer.validate();
        });
    });

    it('opens the page to print an item QR code', () => {
        return app.client.click('.item:nth-of-type(1) .actionArea img[src="../assets/images/qr.svg"]').then(() => {
            return app.client.waitForVisible('#printer');
        }).then(() => {
            return app.client.waitForVisible('#printer img');
        });
    });

    it('returns to the items page', () => {
        return app.client.click('#printer .cancel').then(() => {
            return app.client.waitForVisible('#items');
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
