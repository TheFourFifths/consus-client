import { Application } from 'spectron';
import electron from 'electron-prebuilt';
import { assert } from 'chai';
import MockServer from '../util/mock-server';
// import ModelStore from '../../src/store/model-store';

describe('View all models', function () {

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

    it('shows a list of all models', () => {
        let models;
        mockServer.expect({
            method: 'get',
            endpoint: '/api/model/all',
            request: {},
            response: {
                status: 'success',
                data: {
                    models: [
                        {
                            address: 'm8y7nEtAe',
                            count: 20,
                            description: 'V = IR',
                            faultDescription: '',
                            isFaulty: false,
                            items: [ 'iGwEXUvfA', 'iGwEZVHHE', 'iGwEZVeaT' ],
                            location: 'Shelf 14',
                            manufacturer: "Pancakes R' Us",
                            name: 'Resistor',
                            price: 10.5,
                            vendor: 'Mouzer'
                        }, {
                            address: 'm8y7nFLsT',
                            count: 10,
                            description: 'Something used in computers',
                            faultDescription: '',
                            isFaulty: false,
                            items: [],
                            location: 'Shelf 2',
                            manufacturer: 'Vroom Industries',
                            name: 'Transistor',
                            price: 4,
                            vendor: 'Fankserrogatoman Inc'
                        }
                    ]
                }
            }
        });
        return app.client.click('#view-models').then(() => {
            return app.client.waitForVisible('#models', 5000);
        }).then(() => {
            return app.client.getText('#models h1');
        }).then(headerTxt => {
            assert.match(headerTxt, /All models/);
            return app.client.elements('#models .model');
        }).then(resp => {
            models = resp.value;
            assert.lengthOf(models, 2);
            return app.client.getText('#models:first-child');
        }).then(model => {
            assert.include(model, 'Resistor');
            assert.include(model, 'm8y7nEtAe');
            assert.include(model, 'V = IR');
            return app.client.getText('#models .model:nth-of-type(1)');
        }).then(models => {
            assert.include(models[1], 'Transistor');
            assert.include(models[1], 'm8y7nFLsT');
            assert.include(models[1], 'Something used in computers');
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
