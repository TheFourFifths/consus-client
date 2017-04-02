import { Application } from 'spectron';
import electron from 'electron-prebuilt';
import { assert } from 'chai';
import MockServer from '../util/mock-server';
import models from '../test-cases/models';
import students from '../test-cases/students';

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
            assert.lengthOf(items.value, 0);
        });
    });

    it("Displays if an item is overdue", () => {
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
          assert.include(item, 'Transistor');
          assert.include(item, 'iGwEZVeaT');
          mockServer.validate();
      });
    });

    it("Displays message if student has no items", () => {
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
      return app.client.click("#omnibar").then(() => {
        return app.client.keys('123456');
      }).then(() => {
          return app.client.waitForVisible('#student', 1000000);
      }).then(() => {
          return app.client.getText('#student .student .name');
      }).then(name => {
          assert.strictEqual(name, students[0].name);
          return app.client.getText('#student .student .id');
      }).then(id => {
          assert.strictEqual(id, '123456');
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
              rfid: '314159'
          },
          response: {
              status: 'failure',
              message: 'The student could not be found.'
          }
      });

      return app.client.click("#omnibar").then(() => {
        return app.client.keys("314159");
      }).then(() => {
          return app.client.waitForVisible('#app .modal', 1000000);
      }).then(() => {
          return app.client.getText('#app .modal .modal-content p');
      }).then(message => {
          assert.strictEqual(message, "The rfid that was scanned could not be found. Please enter the student's ID number and we will try to associate the student and rfid");
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
