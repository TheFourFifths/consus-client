import { Application } from 'spectron';
import electron from 'electron-prebuilt';
import { assert } from 'chai';
import MockServer from '../util/mock-server';

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
            endpoint: '/api/model/all',
            response: {
                status: 'success',
                data: {
                    models: [
                        {
                            address: 'm8y7nEtAe',
                            name: 'Resistor',
                            description: 'V = IR',
                            manufacturer: 'Manufacturer',
                            vendor: 'Mouzer',
                            location: 'Shelf 14',
                            isFaulty: false,
                            faultDescription: '',
                            price: 10.5,
                            count: 20,
                            items: [
                                'iGwEZUvfA'
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
                            price: 4.00,
                            count: 10,
                            items: [
                                'iGwEZVHHE'
                            ]
                        }
                    ]
                }
            }
        });
        return app.client.click('#view-models').then(() => {
            return app.client.waitForVisible('#models', 5000);
        }).then(() => {
            return app.client.elements('#models .model');
        }).then(elements => {
            assert.lengthOf(elements.value, 2);
            mockServer.validate();
        });
    });

    it('deletes a model', () => {
        mockServer.expect({
            method: 'delete',
            endpoint: '/api/model',
            qs: {
                modelAddress: 'm8y7nEtAe'
            },
            response: {
                status: 'success',
                data: {
                    deletedModel: {
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
                            'iGwEZUvfA'
                        ]
                    }
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
                            address: 'm8y7nFLsT',
                            name: 'Transistor',
                            description: 'Something used in computers',
                            manufacturer: 'Vroom Industries',
                            vendor: 'Fankserrogatoman Inc',
                            location: 'Shelf 2',
                            isFaulty: false,
                            faultDescription: '',
                            price: 4.00,
                            count: 10,
                            items: [
                                'iGwEZVHHE'
                            ]
                        }
                    ]
                }
            }
        });
        return app.client.click('#models .model:first-child img[src="../assets/images/delete.svg"]').then(() => {
            return app.client.waitForVisible('.modal');
        }).then(() => {
            return app.client.getText('.modal p');
        }).then(text => {
            assert.include(text, 'Resistor');
            return app.client.click('.modal button[type="button"]');
        }).then(() => {
            return app.client.waitForVisible('.modal', 2500, true);
        }).then(() => {
            return app.client.waitForVisible('.toast');
        }).then(() => {
            return app.client.getText('.toast');
        }).then(toast => {
            assert.strictEqual(toast, 'Resistor (m8y7nEtAe) was deleted');
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
