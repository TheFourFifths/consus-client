import { Application } from 'spectron';
import electron from 'electron-prebuilt';
import { assert } from 'chai';
import { getNextDueTimestamp } from '../../.dist/lib/clock';
import MockServer from '../util/mock-server';
import items from '../test-cases/items';
import models from '../test-cases/models';
import students from '../test-cases/students';
describe('Checking out equipment longterm', function () {

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
                id: '123456'
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
    it('adds items to cart', () => {
        mockServer.expect({
            method: 'get',
            endpoint: 'item',
            qs: {
                address: 'iGwEZVvgu'
            },
            response: {
                status: 'success',
                data: items[3]
            }
        });

        return app.client.waitForVisible('.cart input[type="text"]').then(() => {
            return app.client.click('.cart input[type="text"]');
        }).then(() => {
            return app.client.keys('iGwEZVvgu');
        }).then(() => {
            return app.client.waitForVisible('.cart>ul>li');
        }).then(() => {
            return app.client.waitUntil(()  => {
                return app.client.getText(".cart>ul>li").then(text => {
                    return text === "iGwEZVvgu";
                });
            });
        }).then(() => {
            mockServer.validate();
        });
    });
    it('warns of no due date', () => {
        return app.client.click('.cart input[type="checkbox"]').then(() => {
            return app.client.click('.cart input[type="button"]');
        }).then(() => {
            return app.client.waitForVisible('#app .modal .modal-content');
        }).then(() => {
            return app.client.getText('#app .modal .modal-content p');
        }).then(message => {
            assert.strictEqual(message, 'Please enter a due date.');
            return app.client.click('#app .modal .modal-content button');
        });
    });

    it('warns of no professor', () => {
        return app.client.click('#longtermSection input[type="date"]').then(() => {
            return app.client.keys('11112020');
        }).then(() => {
            return app.client.click('.cart input[type="button"]');
        }).then(() => {
            return app.client.waitForVisible('#app .modal .modal-content');
        }).then(() => {
            return app.client.getText('#app .modal .modal-content p');
        }).then(message => {
            assert.strictEqual(message, 'Please enter a professor name.');
            return app.client.click('#app .modal .modal-content button');
        });
    });
    it('checks out the item longterm', () => {

        mockServer.expect({
            method: 'post',
            endpoint: 'checkout/longterm',
            json: {
                adminCode: null,
                studentId: 123456,
                equipmentAddresses: ['iGwEZVvgu'],
                dueDate: '2020-11-11',
                professor: 'Professor'
            },
            response: {
                status: 'success'
            }
        });
        items[3].status = 'CHECKED_OUT';
        items[3].timestamp = getNextDueTimestamp();
        students[0].items.push(items[3]);
        mockServer.expect({
            method: 'get',
            endpoint: 'student',
            qs: {
                id: '123456'
            },
            response: {
                status: 'success',
                data: students[0]
            }
        });


        return app.client.click('#longtermSection input[type="text"]').then(() => {
            return app.client.keys('Professor');
        }).then(() => {
            return app.client.click('.cart input[type="button"]');
        }).then(() => {
            return app.client.waitForVisible('.toast');
        }).then(() => {
            return app.client.getText('.toast');
        }).then(message => {
            assert.strictEqual(message, 'Checkout completed successfully!');
            return app.client.elements('#student .student .equipment .item-info');
        }).then(items => {
            assert.lengthOf(items.value, 2);
            mockServer.validate();
        }).then(()=> {
            return app.client.click('.toast');
        });
    });
    it('checks in one item', () => {
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
            return app.client.keys('iGwEZVvgu')
        }).then(() => {
            return app.client.waitForVisible('.toast');
        }).then(() => {
            mockServer.validate();
        });
    });


});
