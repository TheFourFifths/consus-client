import { Application } from 'spectron';
import electron from 'electron-prebuilt';
import { assert } from 'chai';
import MockServer from '../util/mock-server';
import models from '../test-cases/models';
import items from '../test-cases/items';

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
            assert.match(headerTxt, /All Models/);
            return app.client.elements('#models .model');
        }).then(resp => {
            modelList = resp.value;
            assert.lengthOf(modelList, 4);
            return app.client.getText('#models .model');
        }).then(modelList => {
            let model = modelList[0];
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
                    item: items[3],
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
        return app.client.click(`div#${models[0].address} .btnAddItemToModel`).then(() => {
            return app.client.waitForVisible('.modal', 5000);
        }).then(() => {
            return app.client.click('.modal .modal-buttons button.confirm');
        }).then(()=> {
            return app.client.waitForVisible('.toast', 1000);
        }).then(() => {
            return app.client.getText('.model:nth-of-type(1)');
        }).then(modelList => {
            assert.include(modelList[1], 'Total: 10');
            mockServer.validate();
        });
    });

    it('increments unserialized models', () => {
        let responseData = models[2];
        responseData.inStock++;
        responseData.count++;
        mockServer.expect({
            method: 'patch',
            endpoint: 'model/instock',
            qs: {
                modelAddress: models[2].address
            },
            response: {
                status: 'success',
                data: responseData
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
        return app.client.click(`#${models[2].address} .btnAddItemToModel`).then(() => {
            return app.client.waitForVisible('.modal', 5000);
        }).then(() => {
            return app.client.getText('.modal');
        }).then(modalText => {
            assert.include(modalText, 'Add another Resistor?');
            return app.client.click('.modal .modal-buttons button[type="button"]');
        }).then(()=> {
            return app.client.waitForVisible('.toast', 1000);
        }).then(() => {
            return app.client.click('.toast');
        }).then(() => {
            return app.client.getText('.toast');
        }).then(toastText => {
            assert.include(toastText, 'New Resistor (m8y7nFnMs) created.');
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
