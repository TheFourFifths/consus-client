import express from 'express';
import bodyParser from 'body-parser';
import { assert } from 'chai';

const NOT_LISTENING = 0;
const LISTENING = 1;
const AWAITING_VALIDATION = 2;

/**
 * See: docs/Mock_Server.md
 */

class MockServer {

    constructor() {
        this.status = NOT_LISTENING;
        this.server = null;
        this.request = null;
    }

    listen(config) {
        if (this.status === LISTENING) {
            throw new Error('Mock server is already listening for a request.');
        }
        if (this.status === AWAITING_VALIDATION) {
            throw new Error('Mock server is waiting for the request to be validated.');
        }
        this.status = LISTENING;
        return new Promise(resolve => {
            let app = express();
            app.use(bodyParser.json());
            app[config.method](config.endpoint, (req, res) => {
                if (this.request !== null) { // TODO: test what happens with this error
                    throw new Error('Received an unexpected request.');
                }
                this.status = AWAITING_VALIDATION;
                this.request = ['get', 'delete'].indexOf(config.method) !== -1 ? req.query : req.body;
                res.json(config.response);
            });
            this.server = app.listen(config.port || 80, resolve);
        });
    }

    validate(expectedRequest) {
        if (this.status === LISTENING) {
            throw new Error('Mock server has not received the request.');
        }
        if (this.status === NOT_LISTENING) {
            throw new Error('Mock server is not listening for a request.');
        }
        this.status = NOT_LISTENING;
        this.server.close();
        this.server = null;
        let request = this.request;
        this.request = null;
        assert.deepEqual(request, expectedRequest, 'Unexpected request');
    }

}

let mockServer = new MockServer();

export default mockServer;
