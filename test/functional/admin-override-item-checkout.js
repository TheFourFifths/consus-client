import { Application } from 'spectron';
import electron from 'electron-prebuilt';
import { assert } from 'chai';
import MockServer from '../util/mock-server';

describe('Admin override on item checkout', function () {

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

    after(() => {
        if (app && app.isRunning()) {
            return app.stop().then(() => {
                return mockServer.stop();
            });
        }
    });

    beforeEach(() => {
        mockServer.clearExpectations();
    });

    it('navigates to the student page', () => {
        mockServer.expect({
            method: 'get',
            endpoint: '/api/student',
            qs: {
                id: '123456'
            },
            response: {
                status: 'success',
                data: {
                    id: 123456,
                    name: 'John von Neumann',
                    status: 'C - Current',
                    items: [
                        {
                            address: 'iGwEZUvfA',
                            modelAddress: 'm8y7nEtAe',
                            timestamp: Math.floor(Date.now() / 1000) - 1000000000
                        }
                    ],
                    email: 'vonneumann@msoe.edu',
                    major: 'Chemical Engineering & Mathematics'
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
                        }
                    ]
                }
            }
        });
        return app.client.keys('123456').then(() => {
            return app.client.waitForVisible('#student', 1000000);
        }).then(() => {
            return app.client.getText('#student .student .name');
        }).then(name => {
            assert.strictEqual(name, 'John von Neumann');
            return app.client.getText('#student .student .id');
        }).then(id => {
            assert.strictEqual(id, '123456');
            return app.client.elements('#student .student .equipment .item-info');
        }).then(items => {
            assert.lengthOf(items.value, 1);
            return app.client.getText('#student .student .equipment .item-info');
        }).then(item => {
            assert.include(item, 'Resistor');
            assert.include(item, 'overdue');
            assert.include(item, 'iGwEZUvfA');
            mockServer.validate();
        });
    });

    it('adds an item to the cart', () => {
        mockServer.expect({
            method: 'get',
            endpoint: '/api/item',
            qs: {
                address: 'iGwEZVHHE'
            },
            response: {
               status: 'success',
               data: {
                  address: 'iGwEZVHHE',
                  modelAddress: 'm8y7nEtAe',
                  status: 'AVAILABLE',
                  isFaulty: false,
                  faultDescription: ''
               }
            }
        });
        return app.client.keys('iGwEZVHHE').then(() => {
            return app.client.waitForVisible('ul.cartItems li.cartItem');
        }).then(() => {
            return app.client.getText('ul.cartItems li.cartItem');
        }).then(item => {
            assert.include(item, 'iGwEZVHHE');
            mockServer.validate();
        });
    });

    it('prompts for a pin to check out', () => {
        mockServer.expect({
            method: 'post',
            endpoint: '/api/checkout',
            json: {
                adminCode: null,
                studentId: 123456,
                itemAddresses: ['iGwEZVHHE']
            },
            response: {
                status: 'failure',
                message: 'Student has overdue item'
            }
        });
        return app.client.click('.cart input[type="button"]').then(() => {
            return app.client.waitForVisible('.modal input');
        }).then(() => {
            return app.client.getText('.modal .modal-content p');
        }).then(text => {
            assert.include(text, 'Please Scan Admin ID or Enter Admin Pin');
        });
    });

    it('completes the checkout with the admin pin', () => {
        mockServer.expect({
            method: 'post',
            endpoint: '/api/checkout',
            json: {
                adminCode: '3214',
                studentId: 123456,
                itemAddresses: ['iGwEZVHHE']
            },
            response: {
                status: 'success'
            }
        });
        mockServer.expect({
            method: 'get',
            endpoint: '/api/student',
            qs: {
                id: '123456'
            },
            response: {
                status: 'success',
                data: {
                    id: 123456,
                    name: 'John von Neumann',
                    status: 'C - Current',
                    items: [
                        {
                            address: 'iGwEZUvfA',
                            modelAddress: 'm8y7nEtAe',
                            timestamp: Math.floor(Date.now() / 1000) - 1000000000
                        },
                        {
                            address: 'iGwEZVHHE',
                            modelAddress: 'm8y7nEtAe',
                            timestamp: Math.floor(Date.now() / 1000) + 1000000000
                        }
                    ],
                    email: 'vonneumann@msoe.edu',
                    major: 'Chemical Engineering & Mathematics'
                }
            }
        });
        return app.client.click('.modal .modal-content input').then(() => {
            return app.client.keys('3214');
        }).then(() => {
            return app.client.click('.modal .modal-content button[type="button"]')
        }).then(() => {
            return app.client.waitForVisible('.toast');
        }).then(() => {
            return app.client.getText('.toast');
        }).then(toast => {
            assert.strictEqual(toast, 'Checkout completed successfully!');
            return app.client.elements('#student .student .equipment .item-info');
        }).then(items => {
            assert.lengthOf(items.value, 2);
            return app.client.click('.toast');
        }).then(()=> {
            mockServer.validate();
        });
    });

});
