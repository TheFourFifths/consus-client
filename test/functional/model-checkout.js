import { Application } from 'spectron';
import electron from 'electron-prebuilt';
import { assert } from 'chai';
import MockServer from '../util/mock-server';
import models from '../test-cases/models';
import students from '../test-cases/students';

describe('Checking a model out', function () {

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
                    models: models
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

    it('checks out the model', () => {
        mockServer.expect({
            method: 'get',
            endpoint: 'model',
            qs: {
                address: 'm8y7nFnMs'
            },
            response: {
                status: 'success',
                data: models[2]
           }
        });

        mockServer.expect({
            method: 'post',
            endpoint: 'checkout',
            json: {
                adminCode: null,
                studentId: 123456,
                equipment: [
                    {
                        address: 'm8y7nFnMs',
                        quantity: 1
                    }
                ]
            },
            response: {
                status: 'success'
            }
        });

        mockServer.expect({
            method: 'get',
            endpoint: 'student',
            qs: {
              rfid: '123456'
            },
            response: {
                status: 'success',
                data: {
                    id: 123456,
                    rfid: 123456,
                    name: 'John von Neumann',
                    status: 'C - Current',
                    items: [],
                    models: [ models[2] ],
                    email: 'vonneumann@msoe.edu',
                    major: 'Chemical Engineering & Mathematics'
                }
            }
        });


        return app.client.waitForVisible('.cart input[type="text"]').then(() => {
            return app.client.click('.cart input[type="text"]');
        }).then(() => {
            return app.client.keys('m8y7nFnMs');
        }).then(() => {
            return app.client.waitForVisible('.cart>ul>li');
        }).then(() => {
            return app.client.waitUntil(()  => {
                return app.client.getText(".cart>ul>li").then(text => {
                  return text === "m8y7nFnMs x1";
                });
            });
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
            assert.lengthOf(items.value, 1);
            mockServer.validate();
        }).then(()=> {
            return app.client.click('.toast');
        });
    });

    it("can check out multiple of the same model at once", () => {
        mockServer.expect({
            method: 'get',
            endpoint: 'model',
            qs: {
                address: 'm8y7nFnMs'
            },
            response: {
                status: 'success',
                data: models[2]
           }
        });

        mockServer.expect({
            method: 'get',
            endpoint: 'model',
            qs: {
                address: 'm8y7nFnMs'
            },
            response: {
                status: 'success',
                data: models[2]
           }
        });

        mockServer.expect({
            method: 'post',
            endpoint: 'checkout',
            json: {
                adminCode: null,
                studentId: 123456,
                equipment: [
                    {
                        address: 'm8y7nFnMs',
                        quantity: 2
                    }
                ]
            },
            response: {
                status: 'success'
            }
        });

        mockServer.expect({
            method: 'get',
            endpoint: 'student',
            qs: {
                rfid: '123456'
            },
            response: {
                status: 'success',
                data: {
                    id: 123456,
                    name: 'John von Neumann',
                    status: 'C - Current',
                    items: [],
                    models: [
                        {
                            address: models[2].address,
                            name: models[2].name,
                            quantity: 2
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
            return app.client.keys('m8y7nFnMs');
        }).then(() => {
            return app.client.waitForVisible('.cart>ul>li');
        }).then(() => {
            return app.client.waitUntil(()  => {
                return app.client.getText(".cart>ul>li").then(text => {
                    return text === "m8y7nFnMs x1";
                });
            });
        }).then(() => {
            return app.client.keys('m8y7nFnMs');
        }).then(() => {
            return app.client.waitUntil(()  => {
                return app.client.getText(".cart>ul>li").then(text => {
                    return text === "m8y7nFnMs x2";
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

    it("fails to checkout a serialized model", () => {
        mockServer.expect({
            method: 'get',
            endpoint: 'model',
            qs: {
                address: 'm8y7nFLsT'
            },
            response: {
                status: 'success',
                data: models[0]
            }
        });
        return app.client.setValue('.cart input[type="text"]','m8y7nFLsT').then(() => {
            return app.client.waitForVisible('#app .modal .modal-content');
        }).then(() => {
            return app.client.getText('#app .modal .modal-content p');
        }).then(message => {
            assert.strictEqual(message, "Resistor is not available for checkout.");
            return app.client.click('#app .modal .modal-content button');
        }).then(() => {
            mockServer.validate();
            return app.client.waitForExist("#app .modal", 100, true);
        });
    });

    it("fails to checkout an out of stock model", () => {
        mockServer.expect({
            method: 'get',
            endpoint: 'model',
            qs: {
                address: 'm8y7nFnMs'
            },
            response: {
                status: 'success',
                data: models[3]
            }
        });
        return app.client.setValue('.cart input[type="text"]','m8y7nFnMs').then(() => {
            return app.client.waitForVisible('#app .modal .modal-content');
        }).then(() => {
            return app.client.getText('#app .modal .modal-content p');
        }).then(message => {
            assert.strictEqual(message, "Resistor is out of stock.");
            return app.client.click('#app .modal .modal-content button');
        }).then(() => {
            mockServer.validate();
            return app.client.waitForExist("#app .modal", 100, true);
        });
    });
});
