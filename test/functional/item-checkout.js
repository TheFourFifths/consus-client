import { Application } from 'spectron';
import electron from 'electron-prebuilt';
import { assert } from 'chai';
import { getNextDueTimestamp } from '../../.dist/lib/clock';
import MockServer from '../util/mock-server';
import items from '../test-cases/items';
import models from '../test-cases/models';
import students from '../test-cases/students';

describe('Checking an item out', function () {

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
                equipmentAddresses: ['iGwEZUvfA']
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
            assert.strictEqual(message, 'Checkout completed successfully!');
            return app.client.elements('#student .student .equipment .item-info');
        }).then(items => {
            assert.lengthOf(items.value, 1);
            mockServer.validate();
        }).then(()=> {
            return app.client.click('.toast');
        });
    });

    it("fails to checkout an item that's already checked out", () => {
        mockServer.expect({
            method: 'get',
            endpoint: 'item',
            qs: {
                address: 'iGwEZVeaT'
            },
            response:{
                status: 'success',
                data: items[2]
            }
        });
        return app.client.setValue('.cart input[type="text"]','iGwEZVeaT').then(() => {
        return app.client.waitForVisible('#app .modal .modal-content');
        }).then(() => {
            return app.client.getText('#app .modal .modal-content p');
        }).then(message => {
            assert.strictEqual(message, "This item is already checked out by another student.");
            return app.client.click('#app .modal .modal-content button');
        }).then(() => {
            mockServer.validate();
            return app.client.waitForExist("#app .modal", 100, true);
        });
    });

    it("can check out multiple items at once.", () => {
        mockServer.expect({
            method: 'get',
            endpoint: 'item',
            qs: {
                address: 'iGwEZVHHE'
            },
            response:{
                status: 'success',
                data: items[1]
           }
       });

        mockServer.expect({
            method: 'get',
            endpoint: 'item',
            qs: {
                address: 'iGwEZVvgu'
            },
            response:{
                status: 'success',
                data: items[3]
           }
       });
      mockServer.expect({
          method: 'post',
          endpoint: 'checkout',
          json: {
              adminCode: null,
              studentId: 123456,
              equipmentAddresses: [
                  'iGwEZVHHE',
                  'iGwEZVvgu'
              ]
          },
          response: {
              status: 'success'
          }
      });
      items[1].status = 'CHECKED_OUT';
      items[1].timestamp = getNextDueTimestamp();
      items[3].status = 'CHECKED_OUT';
      items[3].timestamp = getNextDueTimestamp();
      students[0].items.push(items[1]);
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

      return app.client.waitForVisible('.cart input[type="text"]').then(() => {
          return app.client.click('.cart input[type="text"]');
      }).then(() => {
          return app.client.keys('iGwEZVHHE');
      }).then(() => {
          return app.client.waitForVisible('.cart>ul>li');
      }).then(() => {
          return app.client.waitUntil(()  => {
              return app.client.getText(".cart>ul>li").then(text => {
                return text === "iGwEZVHHE";
              });
          });
      }).then(() => {
          return app.client.keys('iGwEZVvgu');
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
          assert.lengthOf(items.value, 3);
          mockServer.validate();
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
                            address: 'iGwEZVHHE',
                            modelAddress: 'm8y7nEtAe',
                            timestamp: Math.floor(Date.now() / 1000) + 1000000000
                        },
                        {
                            address: 'iGwEZVeaT',
                            modelAddress: 'm8y7nEtAe',
                            timestamp: Math.floor(Date.now() / 1000) + 1000000000
                        }
                    ],
                    models: [],
                    email: 'vonneumann@msoe.edu',
                    major: 'Chemical Engineering & Mathematics'
                }
            }
        });

        return app.client.waitForVisible('.cart input[type="text"]').then(() => {
            return app.client.click('.cart input[type="text"]');
        }).then(() => {
            return app.client.keys('iGwEZVeaT');
        }).then(() => {
            return app.client.waitForVisible('.cart>ul>li');
        }).then(() => {
            return app.client.waitUntil(()  => {
                return app.client.getText(".cart>ul>li").then(text => {
                    return text === "iGwEZVeaT";
                });
            });
        }).then(() => {
            return app.client.keys('iGwEZVHHE');
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
            assert.lengthOf(items.value, 2);
            mockServer.validate();
        });
    });

    it("doesn't allow invalid characters in the item field", () => {
        return app.client.waitForVisible('.cart input[type="text"]').then(() => {
            return app.client.click('.cart input[type="text"]');
        }).then(() => {
            return app.client.keys(';');
        }).then(() => {
            return app.client.waitForVisible('#app .modal', 1000000);
        }).then(() => {
            return app.client.getText('#app .modal .modal-content p');
        }).then(message => {
            assert.strictEqual(message, "Please only enter Alphanumeric Characters.");
            return app.client.click("#app .modal .modal-content button");
        }).then(() => {
            mockServer.validate();
            return app.client.waitForExist("#app .modal", 100, true);
        });
    });

    it("doesn't allow the same items to be added to the cart twice", () => {
        mockServer.expect({
            method: 'get',
            endpoint: 'item',
            qs: {
                address: 'iGwEZW6nn'
            },
            response:{
                status: 'success',
                data: items[4]
            }
        });
        mockServer.expect({
            method: 'get',
            endpoint: 'item',
            qs: {
                address: 'iGwEZW6nn'
            },
            response:{
                status: 'success',
                data: items[4]
            }
        });
        return app.client.waitForVisible('.cart input[type="text"]').then(() => {
            return app.client.click('.cart input[type="text"]');
        }).then(() => {
            return app.client.keys('iGwEZW6nn');
        }).then(() => {
            return app.client.keys('iGwEZW6nn');
        }).then(() => {
            return app.client.waitForVisible('#app .modal', 1000000);
        }).then(() => {
            return app.client.getText('#app .modal .modal-content p');
        }).then(message => {
            assert.strictEqual(message, "This item is already in the cart.");
            return app.client.click("#app .modal .modal-content button");
        }).then(() => {
            mockServer.validate();
            return app.client.waitForExist("#app .modal", 100, true);
        });
    });

});
