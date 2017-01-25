import { Application } from 'spectron';
import electron from 'electron-prebuilt';
import { assert } from 'chai';
import MockServer from '../util/mock-server';

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
            endpoint: '/api/item/all',
            response: {
                status: 'success',
                data: {
                    items: [
                        {
                            address: 'iGwEZUvfA',
                            faultDesctiption: '',
                            isFaulty: false,
                            modelAddress: 'm8y7nEtAe',
                            status: 'AVAILABLE'
                        }, {
                            address: 'iGwEZVHHE',
                            faultDescription: '',
                            isFaulty: false,
                            modelAddress: 'm8y7nFLsT',
                            status: 'AVAILABLE'
                        }, {
                            address: 'iGwEZVeaT',
                            faultDescription: '',
                            isFaulty: false,
                            modelAddress: 'm8y7nFLsT',
                            status: 'AVAILABLE'
                        }
                    ]
                }
            }
        });
        mockServer.expect({
            method: 'get',
            endpoint: '/api/model/all',
            response: {
                status: 'success',
                data: {
                    models: [
                        {
                            address: 'm8y7nEtAe',
                            count: 20,
                            description: 'V = IR',
                            allowCheckout: false,
                            items: [ 'iGwEXUvfA', 'iGwEZVHHE', 'iGwEZVeaT' ],
                            location: 'Shelf 14',
                            manufacturer: "Pancakes R' Us",
                            name: 'Resistor',
                            price: 10.5,
                            vendor: 'Mouzer'
                        }, {
                            address: 'm8y7nFLsT',
                            count: 10,
                            description: 'Something used in computers',
                            allowCheckout: false,
                            items: [],
                            location: 'Shelf 2',
                            manufacturer: 'Vroom Industries',
                            name: 'Transistor',
                            price: 4,
                            vendor: 'Fankserrogatoman Inc'
                        }
                    ]
                }
            }
        });
        mockServer.expect({
            method: 'post',
            endpoint: '/api/item',
            json: {
                modelAddress: 'm8y7nEtAe'
            },
            response: {
                status: 'success',
                data: {
                    address: 'iGwEZVvgu',
                    modelName: 'Resistor'
                }
            }
        });
        return app.client.click('#view-items').then(() => {
            return app.client.waitForVisible('#items', 5000);
        }).then(() => {
            return app.client.click('#items button');
        }).then(() => {
            return app.client.waitForVisible('.create-item-form', 1000);
        }).then(() => {
            return app.client.getValue('.create-item-form select option');
        }).then(vals => {
            assert.include(vals, 'm8y7nEtAe');
            assert.include(vals, 'm8y7nFLsT');
            return app.client.selectByValue('.create-item-form select', 'm8y7nEtAe');
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
            endpoint: '/api/item/all',
            response: {
                status: 'success',
                data: {
                    items: [
                        {
                            address: 'iGwEZUvfA',
                            faultDesctiption: '',
                            isFaulty: false,
                            modelAddress: 'm8y7nEtAe',
                            status: 'AVAILABLE'
                        }, {
                            address: 'iGwEZVHHE',
                            faultDescription: '',
                            isFaulty: false,
                            modelAddress: 'm8y7nFLsT',
                            status: 'AVAILABLE'
                        }, {
                            address: 'iGwEZVeaT',
                            faultDescription: '',
                            isFaulty: false,
                            modelAddress: 'm8y7nFLsT',
                            status: 'AVAILABLE'
                        }
                    ]
                }
            }
        });
        mockServer.expect({
            method: 'get',
            endpoint: '/api/model/all',
            response: {
                status: 'success',
                data: {
                    models: [
                        {
                            address: 'm8y7nEtAe',
                            count: 20,
                            description: 'V = IR',
                            allowCheckout: false,
                            items: [ 'iGwEXUvfA', 'iGwEZVHHE', 'iGwEZVeaT' ],
                            location: 'Shelf 14',
                            manufacturer: "Pancakes R' Us",
                            name: 'Resistor',
                            price: 10.5,
                            vendor: 'Mouzer'
                        }, {
                            address: 'm8y7nFLsT',
                            count: 10,
                            description: 'Something used in computers',
                            allowCheckou: false,
                            items: [],
                            location: 'Shelf 2',
                            manufacturer: 'Vroom Industries',
                            name: 'Transistor',
                            price: 4,
                            vendor: 'Fankserrogatoman Inc'
                        }
                    ]
                }
            }
        });
        mockServer.expect({
            method: 'post',
            endpoint: '/api/item',
            json: {
                modelAddress: 'm8y7nFLsT'
            },
            response: {
                status: 'success',
                data: {
                    address: 'iGwEZW6nn',
                    modelName: 'Transistor'
                }
            }
        });
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
            assert.include(vals, 'm8y7nEtAe');
            assert.include(vals, 'm8y7nFLsT');
            return app.client.selectByValue('.create-item-form select', 'm8y7nFLsT');
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
            assert.lengthOf(elements.value, 3);
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
