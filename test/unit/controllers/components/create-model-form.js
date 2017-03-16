import { assert } from "chai";
import sinon from 'sinon';
import * as api from '../../../../.dist/lib/api-client';
import * as router from 'react-router';
import { Dispatcher } from 'consus-core/flux';
import ModelFormController from '../../../../.dist/controllers/components/create-model-form';

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
                new Promise((resolve, reject) => {
                    reject('Bad things happened');
                })
            );
            return ModelFormController.createModel('OIUIO').then(() => {
                assert.isTrue(dispatcherSpy.called);
                assert.strictEqual(dispatcherSpy.getCall(0).args[0], 'ERROR');
                assert.strictEqual(dispatcherSpy.getCall(0).args[1].error, 'The server was not able to create the model. Is the server down?');
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
        beforeEach(() => {
            dispatcherSpy = sinon.spy(Dispatcher, "handleAction");
            getAllModels = sinon.stub(api, "getAllModels");

        });

        it('Dispatches "MODELS_RECEIVED" when done and pushes "/models" to hashHistory',()=>{
            router.hashHistory = {};
            let spy = router.hashHistory.push = sinon.spy();
            getAllModels.returns(
                new Promise(resolve => {
                    resolve({models:[]});
                })
            );

            return ModelFormController.getModels().then(() => {
                assert.isTrue(spy.called);
                assert.strictEqual(spy.getCall(0).args.length, 1);
                assert.strictEqual(spy.getCall(0).args[0], "/models");
                assert.isTrue(dispatcherSpy.called);
                assert.strictEqual(dispatcherSpy.getCall(0).args.length, 2);
                assert.strictEqual(dispatcherSpy.getCall(0).args[0], "MODELS_RECEIVED");
            });
        });

        afterEach(() => {
            dispatcherSpy.restore();
            getAllModels.restore();
        });
    });

    describe("updateModel",() => {
        let dispatcherSpy, updateModel, fileReaderSpy;

        beforeEach(() => {
            dispatcherSpy = sinon.spy(Dispatcher, "handleAction");
            updateModel = sinon.stub(api, "updateModel");
        });

        it('Dispatches "MODEL_UPDATED" when done',()=>{
            updateModel.returns(
                new Promise(resolve => {
                    resolve();
                })
            );
            return ModelFormController.updateModel().then(() => {
                assert.isTrue(dispatcherSpy.called);
                assert.strictEqual(dispatcherSpy.getCall(0).args.length, 2);
                assert.strictEqual(dispatcherSpy.getCall(0).args[0], 'MODEL_UPDATED');
            });
        });

        it('Should dispatch "ERROR" if update model fails', () => {
            updateModel.returns(
                new Promise((resolve, reject) => {
                    reject("The server was not able to update the model. Is the server down?");
                })
            );
            return ModelFormController.updateModel().then(() => {
                assert.isTrue(dispatcherSpy.called);
                assert.strictEqual(dispatcherSpy.getCall(0).args[0], "ERROR");
                assert.strictEqual(dispatcherSpy.getCall(0).args[1].error, 'The server was not able to update the model. Is the server down?');
            });
        });

        afterEach(() => {
            dispatcherSpy.restore();
            updateModel.restore();
        });
    });
});
