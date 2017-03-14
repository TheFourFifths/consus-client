import { Application } from 'spectron';
import electron from 'electron-prebuilt';
import { assert } from 'chai';
import { getNextDueTimestamp } from '../../.dist/lib/clock';
import MockServer from '../util/mock-server';
import items from '../test-cases/items';
import models from '../test-cases/models';
import students from '../test-cases/students';

describe('Checking an item out when new student scanned', function () {

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

    it('checks out the item', () => {
        mockServer.expect({
            method: 'get',
            endpoint: 'item',
            qs: {
                address: 'iGwEZUvfA'
            },
            response:{
                status: 'success',
                data: items[0]
            }
        });
        mockServer.expect({
            method: 'post',
            endpoint: 'checkout',
            json: {
                adminCode: null,
                studentId: 123456,
                itemAddresses: ['iGwEZUvfA']
            },
            response: {
                status: 'success'
            }
        });
        items[0].status = 'CHECKED_OUT';
        items[0].timestamp = getNextDueTimestamp();
        students[0].items.push(items[0]);
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
            endpoint: 'student',
            qs: {
                id: '123456'
            },
            response: {
                status: 'success',
                data: students[0]
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
            return app.client.click('#omnibar input');
        }).then(() => {
            return app.client.keys('123456')
        }).then(() => {
            return app.client.waitForVisible('.toast');
        }).then(() => {
            return app.client.getText('.toast');
        }).then(message => {
            assert.strictEqual(message, 'Checkout completed successfully!');
            return app.client.elements('#student .student .equipment .item-info');
        }).then(items => {
            assert.lengthOf(items.value, 1);
            mockServer.validate();
        }).then(()=> {
            return app.client.click('.toast');
        });
    });



});
