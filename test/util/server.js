import express from 'express';
import bodyParser from 'body-parser';
import { assert } from 'chai';

let success = null;
let app;

export function mockServer(config) {
    success = null;
    return new Promise(resolve => {
        app = express();
        app.use(bodyParser.json());
        console.log(config.method);
        console.log(config.endpoint);
        app[config.method](config.endpoint, (req, res) => {
            console.log('hi');
            try {
                assert.deepEqual(config.expectedRequest, req.body);
                success = true;
            } catch(e) {
                success = false;
            }
            console.log(config.response);
            res.json(config.response);
        });
        app.listen(config.port || 80, () => {
            console.log('hey im listening');
            resolve();
        });
    });
}

export function validateServer() {
    assert.isTrue(success);
    app.close();
}
