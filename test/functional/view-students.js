import { Application } from 'spectron';
import electron from 'electron-prebuilt';
import { assert } from 'chai';
import MockServer from '../util/mock-server';
import students from '../test-cases/students';

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
                    "models":[
                        {
                            "address":"m8y7nEtAe",
                            "name":"Resistor",
                            "description":"V = IR",
                            "manufacturer":"Pancakes R' Us",
                            "vendor":"Mouzer",
                            "location":"Shelf 14",
                            "isFaulty":false,
                            "faultDescription":"",
                            "price":10.5,
                            "count":22,
                            "items":["iGwEZUvfA","iGwEZVHHE","iGwEZVeaT"]
                        },{
                            "address":"m8y7nFLsT",
                            "name":"Transistor",
                            "description":"Something used in computers",
                            "manufacturer":"Vroom Industries",
                            "vendor":"Fankserrogatoman Inc",
                            "location":"Shelf 2",
                            "isFaulty":false,
                            "faultDescription":"",
                            "price":4,
                            "count":10,
                            "items":[]
                        }
                    ]
                }
            }
        });
        let response = {
            "status":"success",
            "data":[
                {
                    "id":111111,
                    "name":"Boaty McBoatface",
                    "status":"C - Current",
                    "email":"mcboatfaceb@msoe.edu",
                    "major":"Hyperdimensional Nautical Machines Engineering",
                    "items":[
                        {
                            "address":"iGwEZVeaT",
                            "studentAddress":"m8y7nFLsT",
                            "status":"CHECKED_OUT",
                            "isFaulty":false,
                            "faultDescription":"",
                            "timestamp":0,
                            "student":{
                                "name":"Boaty McBoatface",
                                "id":111111
                            }
                        }
                    ]
                },
                {
                    "id":123456,
                    "name":"John von Neumann",
                    "status":"C - Current",
                    "email":"neumannJ@msoe.edu",
                    "major":"Software Engineering",
                    "items":[]
                }
            ]
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
