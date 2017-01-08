import { Application } from 'spectron';
import electron from 'electron-prebuilt';
import { assert } from 'chai';

describe('application launch', function () {

    this.timeout(10000);
    let app;

    beforeEach(() => {
        app = new Application({
            path: electron,
            args: ['index.js']
        });
        return app.start();
    });

    afterEach(() => {
        if (app && app.isRunning()) {
            return app.stop();
        }
    });

    it('shows an initial window', () => {
        return app.client.getText('#links button:first-child').then(text => {
            assert.strictEqual(text, 'View all models');
            return app.client.getText('#links button:nth-of-type(2)');
        }).then(text => {
            assert.strictEqual(text, 'View all items');
        });
    });

});
