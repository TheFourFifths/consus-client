import express from 'express';
import bodyParser from 'body-parser';
import { assert } from 'chai';
import { changePort, call } from '../../.dist/lib/api-client';
import clone from 'consus-core/clone';

const OFF = 0;
const STARTING = 1;
const ON = 2;

if (process.env.test === 'integration') {
    changePort(8081);
}

/**
 * See: docs/Mock_Server.md
 */
export default class MockServer {

    constructor() {
        this.server = null;
        this.status = OFF;
        this.expectedCalls = [];
        this.calls = [];
    }

    start(port) {
        return new Promise((resolve, reject) => {
            if (this.status !== OFF) {
                reject(new Error('Server cannot be started unless it is off'));
                return;
            }
            this.status = STARTING;
            let app = express();
            app.use(bodyParser.json());
            app.use('*', (req, res) => {
                let method = req.method.toLowerCase();
                let endpoint = req.originalUrl;
                let qsIndex = endpoint.indexOf('?');
                if (qsIndex !== -1) {
                    endpoint = endpoint.substring(0, qsIndex);
                }
                let qs = req.query;
                let json = req.body;
                let response = {
                    status: 'failure',
                    message: 'Unexpected call'
                };
                if (this.expectedCalls.length > this.calls.length) {
                    response = this.expectedCalls[this.calls.length].response;
                }
                this.calls.push({
                    method,
                    endpoint,
                    qs,
                    json,
                    response
                });
                if (process.env.test !== 'integration') {
                    return res.json(response);
                }
                endpoint = endpoint.substring(5);
                call(endpoint, method, qs, json).then(data => {
                    let serverResponse = {
                        status: 'success'
                    };
                    if (data !== undefined) {
                        serverResponse.data = data;
                    }
                    assert.deepEqual(response, serverResponse);
                    res.json(response);
                }).catch(message => {
                    let serverResponse = {
                        status: 'failure'
                    };
                    if (message !== undefined) {
                        serverResponse.message = message;
                    }
                    assert.deepEqual(response, serverResponse);
                    res.json(response);
                });
            });
            this.server = app.listen(port || 80, () => {
                this.status = ON;
                resolve();
            });
        });
    }

    expect(call) {
        assert.isString(call.method, 'Call method must be a string.');
        assert.isString(call.endpoint, 'Call endpoint must be a string.');
        call.json = call.json || {};
        call.qs = call.qs || {};
        call.endpoint = '/api/' + call.endpoint;
        assert.isObject(call.response, 'Call response must be an object.');
        this.expectedCalls.push(clone(call));
    }

    validate() {
        assert.deepEqual(this.calls, this.expectedCalls);
        this.clearExpectations();
    }

    clearExpectations() {
        this.expectedCalls = [];
        this.calls = [];
    }

    stop() {
        if (this.status !== ON) {
            throw new Error('Server cannot be stopped unless it is on');
            return;
        }
        this.server.close();
        this.server = null;
        this.status = OFF;
    }

}
