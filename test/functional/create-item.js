import { Application } from 'spectron';
import electron from 'electron-prebuilt';
import { assert } from 'chai';
import MockServer from '../util/mock-server';

describe('Creating an Item', function () {

    this.timeout(20000);
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
                    items: [
                        {
                            address: 'iGwEZUvfA',
                            modelAddress: 'm8y7nEtAe',
                            status: 'AVAILABLE',
                            isFaulty: false,
                            faultDescription: ''
                        },
                        {
                            address: 'iGwEZVHHE',
                            modelAddress: 'm8y7nFLsT',
                            status: 'AVAILABLE',
                            isFaulty: false,
                            faultDescription: ''
                        },
                        {
                            address: 'iGwEZVeaT',
                            modelAddress: 'm8y7nFLsT',
                            status: 'AVAILABLE',
                            isFaulty: false,
                            faultDescription: ''
                        }
                    ]
                }
            }
        });
        mockServer.expect({
            method: 'get',
            endpoint: 'model/all',
            response: {
                status: 'success',
                data: {
                    models: [
                        {
                            address: 'm8y7nEtAe',
                            name: 'Resistor',
                            description: 'V = IR',
                            manufacturer: 'Pancakes R\' Us',
                            vendor: 'Mouzer',
                            location: 'Shelf 14',
                            isFaulty: false,
                            faultDescription: '',
                            price: 10.5,
                            count: 20,
                            items: [
                                'iGwEZUvfA',
                                'iGwEZVHHE',
                                'iGwEZVeaT'
                            ]
                        },
                        {
                            address: 'm8y7nFLsT',
                            name: 'Transistor',
                            description: 'Something used in computers',
                            manufacturer: 'Vroom Industries',
                            vendor: 'Fankserrogatoman Inc',
                            location: 'Shelf 2',
                            isFaulty: false,
                            faultDescription: '',
                            price: 4,
                            count: 10,
                            items: []
                        }
                    ]
                }
            }
        });
        mockServer.expect({
            method: 'post',
            endpoint: 'item',
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
            endpoint: 'item/all',
            response: {
                status: 'success',
                data: {
                    items: [
                        {
                            address: 'iGwEZUvfA',
                            modelAddress: 'm8y7nEtAe',
                            status: 'AVAILABLE',
                            isFaulty: false,
                            faultDescription: ''
                        },
                        {
                            address: 'iGwEZVHHE',
                            modelAddress: 'm8y7nFLsT',
                            status: 'AVAILABLE',
                            isFaulty: false,
                            faultDescription: ''
                        },
                        {
                            address: 'iGwEZVeaT',
                            modelAddress: 'm8y7nFLsT',
                            status: 'AVAILABLE',
                            isFaulty: false,
                            faultDescription: ''
                        },
                        {
                            address: 'iGwEZVvgu',
                            modelAddress: 'm8y7nEtAe',
                            status: 'AVAILABLE',
                            isFaulty: false,
                            faultDescription: ''
                        }
                    ]
                }
            }
        });
        mockServer.expect({
            method: 'get',
            endpoint: 'model/all',
            response: {
                status: 'success',
                data: {
                    models: [
                        {
                            address: 'm8y7nEtAe',
                            name: 'Resistor',
                            description: 'V = IR',
                            manufacturer: 'Pancakes R\' Us',
                            vendor: 'Mouzer',
                            location: 'Shelf 14',
                            isFaulty: false,
                            faultDescription: '',
                            price: 10.5,
                            count: 21,
                            items: [
                                'iGwEZUvfA',
                                'iGwEZVHHE',
                                'iGwEZVeaT'
                            ]
                        },
                        {
                            address: 'm8y7nFLsT',
                            name: 'Transistor',
                            description: 'Something used in computers',
                            manufacturer: 'Vroom Industries',
                            vendor: 'Fankserrogatoman Inc',
                            location: 'Shelf 2',
                            isFaulty: false,
                            faultDescription: '',
                            price: 4,
                            count: 10,
                            items: []
                        }
                    ]
                }
            }
        });
        mockServer.expect({
            method: 'post',
            endpoint: 'item',
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
