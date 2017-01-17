import { Application } from 'spectron';
import electron from 'electron-prebuilt';
import { assert } from 'chai';
import MockServer from '../util/mock-server';

describe('Deleting an Item', function () {

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

    it('deletes an item', () => {
        mockServer.expect({
            method: 'get',
            endpoint: '/api/item/all',
            request: {},
            response: {
                status: 'success',
                data: {
                    items: [
                        {
                            address: 'iGwEZUvfA',
                            faultDescription: '',
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
            method: 'delete',
            endpoint: '/api/item',
            request: {
                itemAddress: 'iGwEZUvfA',
                modelAddress: 'm8y7nEtAe'
            },
            response: {
                status: 'failure',
                data: {
                    modelName: 'Resistor',
                    items: [
                        {
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
        return app.client.click('#view-items').then(() => {
            return app.client.waitForVisible('#items', 5000);
        }).then(() => {
            return app.client.elements('#items .item');
        }).then(elements => {
            assert.lengthOf(elements.value, 3);
            console.log('----------CLICKING TRASH----------');
            return app.client.click('.item:nth-of-type(1) .actionArea img[src*="delete"]');
        }).then(() => {
            console.log('----------WAITING FOR TOAST----------');
            return app.client.waitForVisible('.toast', 50000);
        }).then(() => {
            return app.client.getText('.toast');
        }).then(text => {
            console.log('----------CHECKING TOAST MEANING----------');
            assert.strictEqual(text, 'An item was deleted: Resistor (iGwEZUvfA)');
            return app.client.click('.toast').then(() => {  /* don't pollute my toasts! */
                return app.client.waitForVisible('.toast', 10000, true);
            });
        }).then(() => {
            return app.client.getElements('#items .item');
        }).then(elements => {
            assert.lengthOf(elements.value, 2);
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
