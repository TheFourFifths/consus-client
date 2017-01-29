import { Application } from 'spectron';
import electron from 'electron-prebuilt';
import { assert } from 'chai';
import MockServer from '../util/mock-server';

describe('Student Lookup', function () {

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

    it('Looks up a student', () => {
        mockServer.expect({
            method: 'get',
            endpoint: 'student',
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
            endpoint: 'model/all',
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

    it("Displays if an item is overdue", () => {
      mockServer.expect({
          method: 'get',
          endpoint: 'student',
          qs: {
              id: '111111'
          },
          response: {
              status: 'success',
              data: {
                  id: 111111,
                  name: 'Boaty McBoatface',
                  status: 'C - Current',
                  items: [
                      {
                          address: 'iGwEZUvfA',
                          modelAddress: 'm8y7nEtAe',
                          timestamp: 0
                      }
                  ],
                  email: 'vonneumann@msoe.edu',
                  major: 'Chemical Engineering & Mathematics'
              }
          }
      });
      return app.client.click("#omnibar").then(() => {
        return app.client.keys('111111');
      }).then(() => {
          return app.client.waitForVisible('#student', 1000000);
      }).then(() => {
          return app.client.getText('#student .student .name');
      }).then(name => {
          assert.strictEqual(name, 'Boaty McBoatface');
          return app.client.getText('#student .student .id');
      }).then(id => {
          assert.strictEqual(id, '111111');
          return app.client.elements('#student .student .equipment .item-info');
      }).then(items => {
          assert.lengthOf(items.value, 1);
          return app.client.getText('#student .student .equipment .overdue');
      }).then(item => {
          assert.include(item, 'Resistor');
          assert.include(item, 'iGwEZUvfA');
          mockServer.validate();
      });
    });

    it("Displays message if student has no items", () => {
      mockServer.expect({
          method: 'get',
          endpoint: 'student',
          qs: {
              id: '112994'
          },
          response: {
              status: 'success',
              data: {
                  id: 112994,
                  name: 'Ms Steak',
                  status: 'C - Current',
                  items: [],
                  email: 'vonneumann@msoe.edu',
                  major: 'Chemical Engineering & Mathematics'
              }
          }
      });
      return app.client.click("#omnibar").then(() => {
        return app.client.keys('112994');
      }).then(() => {
          return app.client.waitForVisible('#student', 1000000);
      }).then(() => {
          return app.client.getText('#student .student .name');
      }).then(name => {
          assert.strictEqual(name, 'Ms Steak');
          return app.client.getText('#student .student .id');
      }).then(id => {
          assert.strictEqual(id, '112994');
          return app.client.getText('#student .student .equipment-none');
      }).then(message => {
          assert.strictEqual(message, "Student has no equipment checked out.");
          mockServer.validate();
      });
    });

    it("Pops an error modal if the student ID doesn't exist", () => {
      mockServer.expect({
          method: 'get',
          endpoint: 'student',
          qs: {
              id: '000000'
          },
          response: {
              status: 'failure',
              message: 'An invalid student ID was scanned. The student could not be found.'
          }
      });

      return app.client.click("#omnibar").then(() => {
        return app.client.keys("000000");
      }).then(() => {
          return app.client.waitForVisible('#app .modal', 1000000);
      }).then(() => {
          return app.client.getText('#app .modal .modal-content p');
      }).then(message => {
          assert.strictEqual(message, "An invalid student ID was scanned. The student could not be found.");
          return app.client.click("#app .modal .modal-content button");
      }).then(() => {
          mockServer.validate();
          //this checks that the modal goes away, the true "reverses" what it expects.
          return app.client.waitForExist("#app .modal", 100, true);
      });
    });

    it("Pops an error modal if an invalid character is typed.", () => {
      return app.client.click("#omnibar").then(() => {
        return app.client.keys(";");
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
});
