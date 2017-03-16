import { Application } from 'spectron';
import electron from 'electron-prebuilt';
import { assert } from 'chai';
import MockServer from '../util/mock-server';
import students from '../test-cases/students';
import models from '../test-cases/models';

describe('View all students', function () {

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

    beforeEach(() => {
        mockServer.clearExpectations();
    });

    it('shows a list of all students', () => {
        mockServer.expect({
            method: 'get',
            endpoint: 'model/all',
            response: {
                "status": "success",
                "data": {
                    models
                }
            }
        });
        let response = {
            "status": "success",
            "data": students
        };
        mockServer.expect({
            method: 'get',
            endpoint: 'student/all',
            qs: {},
            response
        });
        return app.client.click('#view-students').then(() => {
            return app.client.waitForVisible('div#students', 5000);
        }).then(() => {
            return app.client.getText('#students h1');
        }).then(headerTxt => {
            assert.equal(headerTxt, 'All Students');
            return app.client.elements('.student');
        }).then(resp => {
            assert.lengthOf(resp.value, 2);
            return mockServer.validate();
        });
    });

    it("can edit a student's name", () => {
        let response = {
            status: 'success',
            data: {
                student: {
                    id: 111111,
                    name: "This dude",
                    major: students[1].major,
                    email: students[1].email
                }
            }
        };


        mockServer.expect({
            method: 'patch',
            endpoint: 'student',
            qs: {
                id: '111111'
            },
            json: {
                "items": [{
                    address: 'iGwEZVeaT',
                    faultDescription: "",
                    isFaulty: false,
                    modelAddress: 'm8y7nFLsT',
                    status: 'CHECKED_OUT',
                    timestamp: 0
                }],
                major: 'Hyperdimensional Nautical Machines Engineering',
                status: 'C - Current',
                name: 'This dude',
                email: 'mcboatfaceb@msoe.edu',
                id: 111111
            },
            response
        });

        let response2 = response;
        response2.student = students[1];
        let json2 = students[1];
        json2.name = 'Boaty McBoatface';
        mockServer.expect({
            method: 'patch',
            endpoint: 'student',
            qs: {
                id: '111111'
            },
            json: json2,
            response: response2
        });

        return app.client.click('.student .actionArea img').then(() => {
            return app.client.click('input#nameArea');
        }).then(() => {
            return app.client.keys("This dude");
        }).then(() => {
            return app.client.waitForVisible('.buttonContainer button');
        }).then(() => {
            return app.client.click('.buttonContainer button');
        }).then(() => {
            return app.client.waitForVisible('div.titleArea h2');
        }).then(() => {
            return app.client.getText('div.titleArea h2');
        }).then(text => {
            assert.strictEqual(text[0], "This dude");
        }).then(() => {
            return app.client.click('.student .actionArea img');
        }).then(() => {
            return app.client.click('input#nameArea');
        }).then(() => {
            return app.client.keys("Boaty McBoatface");
        }).then(() => {
            return app.client.waitForVisible('.student button');
        }).then(() => {
            return app.client.click('.student button');
        }).then(() => {
            app.client.waitForVisible('div.titleArea h2');
        }).then(() => {
            return app.client.getText('div.titleArea h2');
        }).then(text => {
            assert.strictEqual(text[0], "Boaty McBoatface");
            return mockServer.validate();
        });
    });

    it("can edit a student's major", () => {
        let response = {
            status: 'success',
            data: {
                student: {
                    "items": [{
                        address: 'iGwEZVeaT',
                        faultDescription: "",
                        isFaulty: false,
                        modelAddress: 'm8y7nFLsT',
                        status: 'CHECKED_OUT',
                        timestamp: 0
                    }],
                    major: 'stuff',
                    status: 'C - Current',
                    name: 'Boaty McBoatface',
                    email: 'mcboatfaceb@msoe.edu',
                    id: 111111
                }
            }
        };

        mockServer.expect({
            method: 'patch',
            endpoint: 'student',
            qs: {
                id: '111111'
            },
            json: {
                "items": [{
                    address: 'iGwEZVeaT',
                    faultDescription: "",
                    isFaulty: false,
                    modelAddress: 'm8y7nFLsT',
                    status: 'CHECKED_OUT',
                    timestamp: 0
                }],
                major: 'stuff',
                status: 'C - Current',
                name: 'Boaty McBoatface',
                email: 'mcboatfaceb@msoe.edu',
                id: 111111
            },
            response
        });

        let response2 = response;
        response2.student = students[1];

        mockServer.expect({
            method: 'patch',
            endpoint: 'student',
            qs: {
                id: '111111'
            },
            json: students[1],
            response: response2
        });

        return app.client.click('.student .actionArea img').then(() => {
            return app.client.click('input#majorArea');
        }).then(() => {
            return app.client.keys("stuff");
        }).then(() => {
            return app.client.waitForVisible('.student button');
        }).then(() => {
            return app.client.click('.student button');
        }).then(() => {
            return app.client.getText('.major');
        }).then(text => {
            assert.strictEqual(text[0], "Major:\nstuff");
        }).then(() => {
            return app.client.waitForVisible('.student .actionArea img');
        }).then(() => {
            return app.client.click('.student .actionArea img');
        }).then(() => {
            return app.client.click('input#majorArea');
        }).then(() => {
            return app.client.keys(students[1].major);
        }).then(() => {
            return app.client.waitForVisible('.student button');
        }).then(() => {
            return app.client.click('.student button');
        }).then(() => {
            return app.client.getText('.major');
        }).then(text => {
            assert.strictEqual(text[0], 'Major:\n' + students[1].major);
            return mockServer.validate();
        });
    });

    it("can edit a student's email", () => {
        let response = {
            status: 'success',
            data: {
                student: {
                    id: 111111,
                    name: students[1].name,
                    major: students[1].major,
                    email: "email@email.com",
                    items: []
                }
            }
        };

        mockServer.expect({
            method: 'patch',
            endpoint: 'student',
            qs: {
                id: '111111'
            },
            json: {
                "items": [{
                    address: 'iGwEZVeaT',
                    faultDescription: "",
                    isFaulty: false,
                    modelAddress: 'm8y7nFLsT',
                    status: 'CHECKED_OUT',
                    timestamp: 0
                }],
                major: 'Hyperdimensional Nautical Machines Engineering',
                status: 'C - Current',
                name: 'Boaty McBoatface',
                email: 'email@email.com',
                id: 111111
            },
            response
        });

        let response2 = response;
        response2.student = students[1];

        mockServer.expect({
            method: 'patch',
            endpoint: 'student',
            qs: {
                id: '111111'
            },
            json: students[1],
            response: response2
        });

        return app.client.click('.student .actionArea img').then(() => {
            return app.client.click('input#emailArea');
        }).then(() => {
            return app.client.keys("email@email.com");
        }).then(() => {
            return app.client.waitForVisible('.student button');
        }).then(() => {
            return app.client.click('.student button');
        }).then(() => {
            return app.client.getText('.email');
        }).then(text => {
            assert.strictEqual(text[0], "Email:\nemail@email.com");
        }).then(() => {
            return app.client.click('.student .actionArea img');
        }).then(() => {
            return app.client.click('input#emailArea');
        }).then(() => {
            return app.client.keys(students[1].email);
        }).then(() => {
            return app.client.waitForVisible('.student button');
        }).then(() => {
            return app.client.click('.student button');
        }).then(() => {
            return app.client.getText('.email');
        }).then(text => {
            assert.strictEqual(text[0], 'Email:\n' + students[1].email);
            mockServer.validate();
        });
    });

    after(() => {
        if (app && app.isRunning()) {
            return app.stop().then(() => {
                return mockServer.stop();
            });
        }
    });

});
