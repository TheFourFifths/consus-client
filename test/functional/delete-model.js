import { Application } from 'spectron';
import electron from 'electron-prebuilt';
import { assert } from 'chai';
import MockServer from '../util/mock-server';
import items from '../test-cases/items';
import models from '../test-cases/models';

describe('Deleting a model', function () {

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

    it('deletes a model', () => {
        mockServer.expect({
            method: 'delete',
            endpoint: 'model',
            qs: {
                modelAddress: models[1].address
            },
            response: {
                status: 'success',
                data: {
                    deletedModel: models[1]
                }
            }
        });
        models.splice(1);
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
        return app.client.click('#models div:nth-of-type(2) .model img[src="../assets/images/delete.svg"]').then(() => {
            return app.client.waitForVisible('.modal');
        }).then(() => {
            return app.client.getText('.modal p');
        }).then(text => {
            assert.include(text, 'Transistor');
            return app.client.click('.modal button[type="button"]');
        }).then(() => {
            return app.client.waitForVisible('.modal', 2500, true);
        }).then(() => {
            return app.client.waitForVisible('.toast');
        }).then(() => {
            return app.client.getText('.toast');
        }).then(toast => {
            assert.strictEqual(toast, 'Transistor (m8y7nFLsT) was deleted');
            items.splice(5, 1);
            items.splice(4, 1);
            items.splice(2, 1);
            items.splice(1, 1);
        }).then(() => {
            return app.client.elements('#models .model');
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
