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

    it('loads the homepage', () => {
        return app.client.getText('#links button:first-child').then(text => {
            assert.strictEqual(text, 'View all models');
            return app.client.getText('#links button:nth-of-type(2)');
        }).then(text => {
            assert.strictEqual(text, 'View all items');
        });
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
            return app.client.elements('#student .student .equipment .item-info');
        }).then(items => {
            assert.lengthOf(items.value, 1);
            return app.client.getText('#student .student .equipment .item-info');
        }).then(item => {
            assert.include(item, 'Resistor');
            assert.include(item, 'iGwEZUvfA');
            mockServer.validate();
        });
    });

    it('checks in the item', () => {
        mockServer.expect({
            method: 'post',
            endpoint: '/api/checkin',
            request: {
                studentId: '123456',
                itemAddress: 'iGwEZUvfA'
            },
            response: {
                status: 'success',
                data: {
                    itemAddress: 'iGwEZUvfA',
                    modelName: 'Resistor'
                }
            }
        });
        return app.client.keys('iGwEZUvfA').then(() => {
            return app.client.waitForVisible('.toast');
        }).then(() => {
            return app.client.getText('.toast');
        }).then(toast => {
            assert.strictEqual(toast, 'Item checked in successfully: Resistor (iGwEZUvfA)');
            return app.client.click('.toast');
        }).then(() => {
            return app.client.waitForVisible('.toast', false);
        }).then(() => {
            return app.client.elements('#student .student .equipment .item-info');
        }).then(items => {
            assert.lengthOf(items.value, 0);
            return app.client.getText('#student .student .equipment-none');
        }).then(equipment => {
            assert.strictEqual(equipment, 'Student has no equipment checked out.');
            mockServer.validate();
        });
    });

});
