import { Application } from 'spectron';
import electron from 'electron-prebuilt';
import { assert } from 'chai';
import MockServer from '../util/mock-server';
import items from '../test-cases/items';
import models from '../test-cases/models';
import students from '../test-cases/students';

describe.only('Able to add a fault to an item', function () {
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

    it('navigates to the items page', () => {
        mockServer.expect({
            method: 'get',
            endpoint: 'item/all',
            response: {
                status: 'success',
                data: {
                    items
                }
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
        return app.client.click('#omnibar img').then(() => {
            return app.client.click("#view-items");
        }).then(() => {
            return app.client.waitForVisible('#items');
            mockServer.validate();
        });
    });

    it('can add a fault to an item.', () => {
        let faultDescription = "Oopes";
        let resItem = {
            address: 'iGwEZUvfA',
            modelAddress: 'm8y7nEtAe',
            status: 'AVAILABLE',
            isFaulty: true,
            faultHistory: [{
                timestamp: 10000,
                faultDescription
            }],
            isCheckedOutTo: 111111
        };
        mockServer.expect({
            method: 'post',
            endpoint: 'item/fault',
            json: {
                itemAddress: items[0].address,
                faultDescription
            },
            response: {
                item: resItem
            }
        });

        mockServer.expect({
            method: 'get',
            endpoint: 'item/all',
            response: {
                items: [resItem, items[1]]
            }
        });

        return app.client.click('.infoArea .faultArea button').then(() => {
            return app.client.waitForVisible(".infoArea .faultArea input");
        }).then(() => {
            return app.client.click(".infoArea .faultArea input");
        }).then(() => {
            return app.client.keys(faultDescription);
        }).then(() => {
            return app.client.click('.saveButton');
        }).then(() => {
            // mockServer.validate();
            return app.client.waitForVisible(".infoArea .faultArea input",5000,true);
        });
    });
})
