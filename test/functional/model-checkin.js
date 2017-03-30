import { Application } from 'spectron';
import electron from 'electron-prebuilt';
import { assert } from 'chai';
import MockServer from '../util/mock-server';
import models from '../test-cases/models';
import students from '../test-cases/students';

describe('Checking a model in', function () {

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
                id: '999999'
            },
            response: {
                status: 'success',
                data: students[2]
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
        return app.client.keys('999999').then(() => {
            return app.client.waitForVisible('#student', 1000000);
        }).then(() => {
            return app.client.getText('#student .student .name');
        }).then(name => {
            assert.strictEqual(name, students[2].name);
            return app.client.getText('#student .student .id');
        }).then(id => {
            assert.strictEqual(id, '999999');
            return app.client.elements('#student .student .equipment .item-info');
        }).then(items => {
            assert.lengthOf(items.value, 2);
        });
    });

    it('checks in one model', () => {
        mockServer.expect({
            method: 'post',
            endpoint: 'checkin/model',
            json: {
                studentId: 123456,
                modelAddress: models[3].address,
                quantity: 1
            },
            response: {
                status: 'success',
                data: {
                    modelAddress: models[3].address,
                    modelName: models[3].name,
                    quantity: 1
                }
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
                data: {
                    id: 999999,
                    name: 'Testy McTesterson',
                    status: 'C - Current',
                    email: 'mctestersont@msoe.edu',
                    major: 'Engineering Engineering',
                    items: [],
                    models: [
                        {
                            address: models[2].address,
                            name: models[2].name,
                            quantity: 5
                        }
                    ]
                }
            }
        });
        return app.client.waitForVisible(`#${models[3].address}`).then(() => {
            return app.client.click(`#${models[3].address}`);
        }).then(() => {
            return app.client.waitForVisible('.toast');
        }).then(() => {
            return app.client.getText('.toast');
        }).then(toast => {
            assert.strictEqual(toast, `1 ${models[3].name}(s) (${models[3].address}) checked in successfully`);
            return app.client.click('.toast');
        }).then(() => {
            return app.client.waitForVisible('.toast', 5000, true);
        }).then(() => {
            return app.client.elements('#student .student .equipment .item-info');
        }).then(items => {
            assert.lengthOf(items.value, 1);
        });
    });

    it('checks in all models of one type', () => {
        mockServer.expect({
            method: 'post',
            endpoint: 'checkin/model',
            json: {
                studentId: 123456,
                modelAddress: models[2].address,
                quantity: 5
            },
            response: {
                status: 'success',
                data: {
                    modelAddress: models[2].address,
                    modelName: models[2].name,
                    quantity: 5
                }
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
                data: {
                    id: 999999,
                    name: 'Testy McTesterson',
                    status: 'C - Current',
                    email: 'mctestersont@msoe.edu',
                    major: 'Engineering Engineering',
                    items: [],
                    models: []
                }
            }
        });
        return app.client.waitForVisible(`#all${models[2].address}`).then(() => {
            return app.client.click(`#all${models[2].address}`);
        }).then(() => {
            return app.client.waitForVisible('.toast');
        }).then(() => {
            return app.client.getText('.toast');
        }).then(toast => {
            assert.strictEqual(toast, `5 ${models[2].name}(s) (${models[2].address}) checked in successfully`);
            return app.client.click('.toast');
        }).then(() => {
            return app.client.waitForVisible('.toast', 5000, true);
        }).then(() => {
            return app.client.elements('#student .student .equipment .item-info');
        }).then(items => {
            assert.lengthOf(items.value, 0);
        });
    });

});
