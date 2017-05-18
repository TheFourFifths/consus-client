import { Application } from 'spectron';
import electron from 'electron-prebuilt';
import { assert } from 'chai';
import MockServer from '../util/mock-server';
import items from '../test-cases/items';
import models from '../test-cases/models';

describe('Creating an Item', function () {

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

    it('creates a new item', () => {
        mockServer.expect({
            method: 'get',
            endpoint: 'item/all',
            response: {
                status: 'success',
                data: {
                    items: items.slice(0, 3)
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
        models[0].count ++;
        return app.client.click('#view-items').then(() => {
            return app.client.waitForVisible('#items', 5000);
        }).then(() => {
            return app.client.click('#items button');
        }).then(() => {
            return app.client.waitForVisible('.create-item-form', 1000);
        }).then(() => {
            return app.client.getValue('.create-item-form select option');
        }).then(vals => {
            assert.include(vals, models[0].address);
            assert.include(vals, models[1].address);
            return app.client.selectByValue('.create-item-form select', models[0].address);
        }).then(() => {
            return app.client.submitForm('.create-item-form form');
        }).then(() => {
            return app.client.waitForVisible('.toast', 2500);
        }).then(() => {
            return app.client.getText('.toast');
        }).then(text => {
            assert.strictEqual(text, 'New item added: Resistor (iGwEZVvgu)');
            return app.client.click('.toast');
        }).then(() => {
            return app.client.waitForVisible('.toast', 10000, true);
        }).then(() => {
            return app.client.elements('#items .item');
        }).then(elements => {
            assert.lengthOf(elements.value, 3);
            mockServer.validate();
        });
    });

    it('tells the user to select a model', () => {
        mockServer.expect({
            method: 'get',
            endpoint: 'item/all',
            response: {
                status: 'success',
                data: {
                    items: items.slice(0, 4)
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
            method: 'post',
            endpoint: 'item',
            json: {
                modelAddress: models[1].address
            },
            response: {
                status: 'success',
                data: {
                    address: 'iGwEZW6nn',
                    modelName: 'Transistor'
                }
            }
        });
        models[1].count ++;
        return app.client.click('#omnibar img').then(() => {
            return app.client.click('#view-items');
        }).then(() => {
            return app.client.waitForVisible('#items', 5000);
        }).then(() => {
            return app.client.click('#items button');
        }).then(() => {
            return app.client.waitForVisible('.create-item-form', 1000);
        }).then(() => {
            return app.client.submitForm('.create-item-form form');
        }).then(() => {
            return app.client.waitForVisible('.toast', 1000);
        }).then(() => {
            return app.client.getText('.toast');
        }).then(text => {
            assert.strictEqual(text, 'Please select a model.');
            return app.client.click('.toast');
        }).then(() => {
            return app.client.waitForVisible('.toast', 10000, true);
        }).then(() => {
            return app.client.getValue('.create-item-form select option');
        }).then(vals => {
            assert.include(vals, models[0].address);
            assert.include(vals, models[1].address);
            return app.client.selectByValue('.create-item-form select', models[1].address);
        }).then(() => {
            return app.client.submitForm('.create-item-form form');
        }).then(() => {
            return app.client.waitForVisible('.toast', 2500);
        }).then(() => {
            return app.client.getText('.toast');
        }).then(text => {
            assert.strictEqual(text, 'New item added: Transistor (iGwEZW6nn)');
            return app.client.click('.toast');
        }).then(() => {
            return app.client.waitForVisible('.toast', 10000, true);
        }).then(() => {
            return app.client.elements('#items .item');
        }).then(elements => {
            assert.lengthOf(elements.value, 4);
            mockServer.validate();
        });
    });

    it('creates another new item', () => {
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
            endpoint: 'model/all',
            response: {
                status: 'success',
                data: {
                    models
                }
            }
        });
        mockServer.expect({
            method: 'post',
            endpoint: 'item',
            json: {
                modelAddress: models[1].address
            },
            response: {
                status: 'success',
                data: {
                    address: 'iGwEZWXhn',
                    modelName: 'Transistor'
                }
            }
        });
        models[1].count ++;
        return app.client.waitForVisible('#items', 5000).then(() => {
            return app.client.click('#items button');
        }).then(() => {
            return app.client.waitForVisible('.create-item-form', 1000);
        }).then(() => {
            return app.client.getValue('.create-item-form select option');
        }).then(vals => {
            assert.include(vals, models[0].address);
            assert.include(vals, models[1].address);
            return app.client.selectByValue('.create-item-form select', models[1].address);
        }).then(() => {
            return app.client.submitForm('.create-item-form form');
        }).then(() => {
            return app.client.waitForVisible('.toast', 2500);
        }).then(() => {
            return app.client.getText('.toast');
        }).then(text => {
            assert.strictEqual(text, 'New item added: Transistor (iGwEZWXhn)');
            return app.client.click('.toast');
        }).then(() => {
            return app.client.waitForVisible('.toast', 10000, true);
        }).then(() => {
            return app.client.elements('#items .item');
        }).then(elements => {
            assert.lengthOf(elements.value, 4);
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
