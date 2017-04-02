import { Application } from 'spectron';
import electron from 'electron-prebuilt';
import { assert } from 'chai';
import MockServer from '../util/mock-server';
import items from '../test-cases/items';
import models from '../test-cases/models';
import students from '../test-cases/students';

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
            endpoint: 'student',
            qs: {
                rfid: '111111'
            },
            response: {
                status: 'success',
                data: students[1]
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
        return app.client.keys('111111').then(() => {
            return app.client.waitForVisible('#student', 1000000);
        }).then(() => {
            return app.client.getText('#student .student .name');
        }).then(name => {
            assert.strictEqual(name, students[1].name);
            return app.client.getText('#student .student .id');
        }).then(id => {
            assert.strictEqual(id, '111111');
            return app.client.elements('#student .student .equipment .item-info');
        }).then(items => {
            assert.lengthOf(items.value, 1);
            return app.client.getText('#student .student .equipment .item-info');
        }).then(item => {
            assert.include(item, 'Transistor');
            assert.include(item, 'overdue');
            assert.include(item, 'iGwEZVeaT');
            mockServer.validate();
        });
    });

    it('adds an item to the cart', () => {
        mockServer.expect({
            method: 'get',
            endpoint: 'item',
            qs: {
                address: 'iGwEZVHHE'
            },
            response: {
               status: 'success',
               data: items[1]
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
            endpoint: 'checkout',
            json: {
                adminCode: null,
                studentId: 111111,
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
            endpoint: 'checkout',
            json: {
                adminCode: '3214',
                studentId: 111111,
                equipment: [
                    {
                        address: 'iGwEZVHHE'
                    }
                ]
            },
            response: {
                status: 'success'
            }
        });
        items[1].status = 'CHECKED_OUT';
        students[1].items.push(items[1]);
        mockServer.expect({
            method: 'get',
            endpoint: 'student',
            qs: {
                rfid: '111111'
            },
            response: {
                status: 'success',
                data: students[1]
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
