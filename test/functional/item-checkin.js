import { Application } from 'spectron';
import electron from 'electron-prebuilt';
import { assert } from 'chai';
import MockServer from '../util/mock-server';
import items from '../test-cases/items';
import models from '../test-cases/models';
import students from '../test-cases/students';

describe('Checking an item in', function () {

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
            endpoint: 'student',
            qs: {
                rfid: '123456'
            },
            response: {
                status: 'success',
                data: students[0]
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
        return app.client.keys("rfid:123456").then(() => {
            return app.client.keys('Enter');
        }).then(() => {
            return app.client.waitForVisible('#student', 5000);
        }).then(() => {
            return app.client.getText('#student .student .name');
        }).then(name => {
            assert.strictEqual(name, 'John von Neumann');
            return app.client.getText('#student .student .id');
        }).then(id => {
            assert.strictEqual(id, '123456');
            return app.client.elements('#student .student .equipment .item-info');
        }).then(items => {
            assert.lengthOf(items.value, 3);
        });
    });

    it('checks in one item', () => {
        mockServer.expect({
            method: 'post',
            endpoint: 'checkin',
            json: {
                studentId: 123456,
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
            items[0].status = 'AVAILABLE';
            students[0].items.shift();
            return app.client.click('.toast');
        }).then(() => {
            return app.client.waitForVisible('.toast', 5000, true);
        }).then(() => {
            return app.client.elements('#student .student .equipment .item-info');
        }).then(items => {
            assert.lengthOf(items.value, 2);
        });
    });

    it('checks in the remaining items', () => {
        mockServer.expect({
            method: 'post',
            endpoint: 'checkin',
            json: {
                studentId: 123456,
                itemAddress: 'iGwEZVHHE'
            },
            response: {
                status: 'success',
                data: {
                    itemAddress: 'iGwEZVHHE',
                    modelName: 'Transistor'
                }
            }
        });
        mockServer.expect({
            method: 'post',
            endpoint: 'checkin',
            json: {
                studentId: 123456,
                itemAddress: 'iGwEZVvgu'
            },
            response: {
                status: 'success',
                data: {
                    itemAddress: 'iGwEZVvgu',
                    modelName: 'Resistor'
                }
            }
        });
        return app.client.click('.cart input[type="text"]').then(() => {
            return app.client.keys('iGwEZVHHE');
        }).then(() => {
            return app.client.waitForVisible('.toast');
        }).then(() => {
            return app.client.getText('.toast');
        }).then(toast => {
            assert.strictEqual(toast, 'Item checked in successfully: Transistor (iGwEZVHHE)');
            items[1].status = 'AVAILABLE';
            students[0].items.shift();
            return app.client.click('.toast');
        }).then(() => {
            return app.client.waitForVisible('.toast', 5000, true);
        }).then(() => {
            return app.client.click('.cart input[type="text"]');
        }).then(() => {
            return app.client.elements('#student .student .equipment .item-info');
        }).then(items => {
            assert.lengthOf(items.value, 1);
        }).then(() => {
            return app.client.keys('iGwEZVvgu');
        }).then(() => {
            return app.client.waitForVisible('.toast');
        }).then(() => {
            return app.client.getText('.toast');
        }).then(toast => {
            assert.strictEqual(toast, 'Item checked in successfully: Resistor (iGwEZVvgu)');
            items[3].status = 'AVAILABLE';
            students[0].items.shift();
            return app.client.click('.toast');
        }).then(() => {
            return app.client.waitForVisible('.toast', 5000, true);
        }).then(items => {
            return app.client.getText('#student .student .equipment-none');
        }).then(equipment => {
            assert.strictEqual(equipment, 'Student has no equipment checked out.');
            mockServer.validate();
        });
    });

});
