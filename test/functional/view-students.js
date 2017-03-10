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
                "status":"success",
                "data":{
                    models
                }
            }
        });
        let response = {
            "status":"success",
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

    after(() => {
        if (app && app.isRunning()) {
            return app.stop().then(() => {
                return mockServer.stop();
            });
        }
    });

});
