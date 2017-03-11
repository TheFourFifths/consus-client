import { Application } from 'spectron';
import electron from 'electron-prebuilt';
import { assert } from 'chai';
import MockServer from '../util/mock-server';
import models from '../test-cases/models';

describe('View all models', function () {

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

    it('shows a list of all models', () => {
        let modelList;
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
            return app.client.getText('#models h1');
        }).then(headerTxt => {
            assert.match(headerTxt, /All models/);
            return app.client.elements('#models .model');
        }).then(resp => {
            modelList = resp.value;
            assert.lengthOf(modelList, 4);
            return app.client.getText('#models:first-child');
        }).then(model => {
            assert.include(model, 'Resistor');
            assert.include(model, 'm8y7nEtAe');
            assert.include(model, 'V = IR');
            return app.client.getText('#models .model:nth-of-type(1)');
        }).then(modelList => {
            assert.include(modelList[1], 'Transistor');
            assert.include(modelList[1], 'm8y7nFLsT');
            assert.include(modelList[1], 'Something used in computers');
            mockServer.validate();
        });
    });

    it('adds a new item to the model', () => {
        mockServer.expect({
            method: 'post',
            endpoint: 'item',
            json: {
                modelAddress: models[0].address
            },
            response: {
                status: 'success',
                data: {
                    address: 'iGwEZVvgu',
                    modelName: 'Resistor'
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
        return app.client.click('.btnAddItemToModel:nth-of-type(1)').then(() => {
            return app.client.waitForVisible('.modal', 5000);
        }).then(() => {
            return app.client.click('.modal .modal-content button[type="button"]');
        }).then(()=> {
            return app.client.waitForVisible('.toast', 1000);
        }).then(() => {
            return app.client.getText('.model:nth-of-type(1)')
        }).then(modelList => {
            assert.include(modelList[1], 'Quantity: 10');
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
