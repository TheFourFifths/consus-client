import { assert } from "chai";
import sinon from 'sinon';
import * as api from '../../../../.dist/lib/api-client';
import * as router from 'react-router';
import { Dispatcher } from 'consus-core/flux';
import ModelFormController from '../../../../.dist/controllers/components/create-model-form'

describe('ModelFormController', () => {
    describe("createModel", () => {
        let createModel, dispatcherSpy;

        beforeEach(() => {
            dispatcherSpy = sinon.spy(Dispatcher, "handleAction");

            createModel = sinon.stub(api, "createModel");
        });

        it('Should push "/models" to the hashHistory after item is created',() => {
            //Have to set up hashHistory because it currently doesn't exist without the browser.
            router.hashHistory = {};
            let spy = router.hashHistory.push = sinon.spy();

            createModel.returns(
                new Promise(resolve => {
                    resolve({address:'xlkdfjkls'});
                })
            );

            return ModelFormController.createModel('OIUIO').then(() => {
                assert.isTrue(spy.called);
                assert.strictEqual(spy.getCall(0).args.length, 1);
                assert.strictEqual(spy.getCall(0).args[0], "/models");
                assert.isTrue(dispatcherSpy.called);
                assert.strictEqual(dispatcherSpy.getCall(0).args.length, 2);
                assert.strictEqual(dispatcherSpy.getCall(0).args[0], "MODEL_CREATED");
            });
        });

        it('Should dispatch "ERROR" if create model fails', () => {
            createModel.returns(
                new Promise((resolve,reject) => {
                    reject('Bad things happened');
                })
            );

            ModelFormController.createModel('OIUIO').then(
                assert.fail
            ).catch((e) => {
                assert.strictEqual(e.message, 'The server was not able to create the item. Is the server down?');
            });
        });

        afterEach(() => {
            createModel.restore();
            dispatcherSpy.restore();
            Dispatcher.handleAction("CLEAR_ERROR");
        });
    });

    describe("getModels",() => {
        let dispatcherSpy, getAllModels;
        before(() => {
            dispatcherSpy = sinon.spy(Dispatcher, "handleAction");
            getAllModels = sinon.stub(api, "getAllModels");
            getAllModels.returns(
                new Promise(resolve => {
                    resolve({models:[]});
                })
            );
        });

        it('Dispatches "MODELS_RECEIVED" when done and pushes "/models" to hashHistory',()=>{
            router.hashHistory = {};
            let spy = router.hashHistory.push = sinon.spy();

            return ModelFormController.getModels().then(() => {
                assert.isTrue(spy.called);
                assert.strictEqual(spy.getCall(0).args.length, 1);
                assert.strictEqual(spy.getCall(0).args[0], "/models");
                assert.isTrue(dispatcherSpy.called);
                assert.strictEqual(dispatcherSpy.getCall(0).args.length, 2);
                assert.strictEqual(dispatcherSpy.getCall(0).args[0], "MODELS_RECEIVED");
            });
        });

        after(() => {
            dispatcherSpy.restore();
            getAllModels.restore();
        });
    });
});
