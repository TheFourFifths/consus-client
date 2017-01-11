import { Application } from 'spectron';
import electron from 'electron-prebuilt';
import { assert } from 'chai';
import MockServer from '../util/mock-server';

describe('item checkout', function () {

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
            request: {
                id: '123456'
            },
            response: {
                status: 'success',
                data: {
                    id: '123456',
                    name: 'John von Neumann',
                    status: 'C - Current',
                    items: [],
                    email: 'vonneumann@msoe.edu',
                    major: 'Chemical Engineering & Mathematics'
                }
            }
        });
        mockServer.expect({
            method: 'get',
            endpoint: '/api/model/all',
            request: {},
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
            mockServer.validate();
        });
    });

    it('checks out the item', () => {

        mockServer.expect({
            method: 'get',
            endpoint: '/api/item',
            request: {
                address: 'iGwEZUvfA'
            },
            response:{
                "status":"success",
                "data":{
                    "address":"iGwEZUvfA",
                    "modelAddress":"m8y7nEtAe",
                    "status":"AVAILABLE",
                    "isFaulty":false,
                    "faultDescription":""
                }
           }
        });

        mockServer.expect({
            method: 'post',
            endpoint: '/api/checkout',
            request: {
                adminCode: null,
                studentId: '123456',
                itemAddresses: ['iGwEZUvfA']
            },
            response: {
                status: 'success'
            }
        });

        mockServer.expect({
            method: 'get',
            endpoint: '/api/student',
            request: {
              id: "123456"
            },
            response: {
                status: 'success',
                data: {
                    id: '123456',
                    name: 'John von Neumann',
                    status: 'C - Current',
                    items: [
                        {
                            address: 'iGwEZUvfA',
                            modelAddress: 'm8y7nEtAe',
                            timestamp: Math.floor(Date.now() / 1000) + 1000000000
                        }
                    ],
                    email: 'vonneumann@msoe.edu',
                    major: 'Chemical Engineering & Mathematics'
                }
            }
        });


        return app.client.waitForVisible('.cart input[type="text"]').then(() => {
            return app.client.click('.cart input[type="text"]');
        }).then(() => {
            return app.client.keys('iGwEZUvfA');
        }).then(() => {
            return app.client.waitForVisible('.cart>ul>li');
        }).then(() => {
            return app.client.waitUntil(()  => {
                return app.client.getText(".cart>ul>li").then(text => {
                  return text === "iGwEZUvfA";
                });
            });
        }).then(() => {
            return app.client.click('.cart input[type="button"]');
        }).then(() => {
            return app.client.waitForVisible('.toast');
        }).then(() => {
            return app.client.getText('.toast');
        }).then(message => {
            assert.strictEqual(message, "Checkout completed successfully!");
            return app.client.elements('#student .student .equipment .item-info');
        }).then(items => {
            assert.lengthOf(items.value, 1);
            mockServer.validate();
        });
    });

});
