import { assert } from "chai";
import sinon from 'sinon';
import * as api from '../../../../.dist/lib/api-client';
import { Dispatcher } from 'consus-core/flux';
import ModelController from '../../../../.dist/controllers/components/model';
import ModelStore from '../../../../.dist/store/model-store';

describe("ModelController", () => {
    describe("getModel",() => {
        let dispatcherSpy, searchModel;
        beforeEach(() => {
            dispatcherSpy = sinon.spy(Dispatcher, "handleAction");
            searchModel = sinon.stub(api, "searchModel");
        });

        it('Dispatches "MODEL_FOUND" when Model is found',()=>{

            searchModel.returns(
                new Promise(resolve => {
                    resolve({status:"AVAILABLE"});
                })
            );

            return ModelController.getModel("12kl3").then(() => {
                assert.isTrue(dispatcherSpy.called);
                assert.strictEqual(dispatcherSpy.getCall(0).args.length, 2);
                assert.strictEqual(dispatcherSpy.getCall(0).args[0], "MODEL_FOUND");
            });

        });

        it('Dispatches "NO_MODEL_FOUND" when model is not found', () => {
            searchModel.returns(
                new Promise((resolve, reject) => {
                    reject('nope');
                })
            );

            return ModelController.getModel("12kl3").then(() => {
                assert.isTrue(dispatcherSpy.called);
                assert.strictEqual(dispatcherSpy.getCall(0).args.length, 1);
                assert.strictEqual(dispatcherSpy.getCall(0).args[0], "NO_MODEL_FOUND");
            });
        });

        afterEach(() => {
            dispatcherSpy.restore();
            searchModel.restore();
        });
    });

    describe('newModelInstance', () => {
        let dispatcherSpy, createItem, getAllModels, addUnserializedModel, getModelByAddress;

        beforeEach(() => {
            dispatcherSpy = sinon.spy(Dispatcher, "handleAction");
            getModelByAddress = sinon.stub(ModelStore, "getModelByAddress");
            createItem = sinon.stub(api, "createItem");
            getAllModels = sinon.stub(api, "getAllModels");
            addUnserializedModel = sinon.stub(api, "addUnserializedModel");
        });

        it('Dispatches "ITEM_CREATED" when item is created for model', () => {
            let modelAddress = 'fake';
            getModelByAddress.returns({
                address: modelAddress,
                allowCheckout: false
            });
            createItem.returns(
                new Promise((resolve, reject) => {
                    resolve('nothing');
                })
            );
            getAllModels.returns(
                new Promise((resolve, reject) => {
                    resolve({status:"AVAILABLE"});
                })
            );
            return ModelController.newModelInstance(modelAddress).then(() => {
                assert.isTrue(dispatcherSpy.called);
                assert.strictEqual(dispatcherSpy.getCall(0).args.length, 2);
                assert.strictEqual(dispatcherSpy.getCall(0).args[0], "ITEM_CREATED");
            });
        });

        it('Dispatches "ERROR" when there is an error creating an item', () => {
            let modelAddress = 'fake';
            getModelByAddress.returns({
                address: modelAddress,
                allowCheckout: false
            });
            createItem.returns(
                new Promise((resolve, reject) => {
                    reject('nothing');
                })
            );

            return ModelController.newModelInstance(modelAddress).then(() => {
                assert.isTrue(dispatcherSpy.called);
                assert.strictEqual(dispatcherSpy.getCall(0).args.length, 2);
                assert.strictEqual(dispatcherSpy.getCall(0).args[0], "ERROR");
            });
        });

        it('Dispatches "UNSERIALIZED_MODEL_ADDED" when new instance of unserialized model is created', () => {
            let modelAddress = 'fake';
            getModelByAddress.returns({
                address: modelAddress,
                allowCheckout: true
            });
            addUnserializedModel.returns(
                new Promise((resolve, reject) => {
                    resolve('nothing');
                })
            );
            getAllModels.returns(
                new Promise((resolve, reject) => {
                    resolve({status:"AVAILABLE"});
                })
            );
            return ModelController.newModelInstance(modelAddress).then(() => {
                assert.isTrue(dispatcherSpy.called);
                assert.strictEqual(dispatcherSpy.getCall(0).args.length, 2);
                assert.strictEqual(dispatcherSpy.getCall(0).args[0], "UNSERIALIZED_MODEL_ADDED");
            });
        });

        it('Dispatches "ERROR" when there is an error for unserialized models', () => {
            let modelAddress = 'fake';
            getModelByAddress.returns({
                address: modelAddress,
                allowCheckout: true
            });
            addUnserializedModel.returns(
                new Promise((resolve, reject) => {
                    reject('nothing');
                })
            );

            return ModelController.newModelInstance(modelAddress).then(() => {
                assert.isTrue(dispatcherSpy.called);
                assert.strictEqual(dispatcherSpy.getCall(0).args.length, 2);
                assert.strictEqual(dispatcherSpy.getCall(0).args[0], "ERROR");
            });
        });

        afterEach(() => {
            getAllModels.restore();
            dispatcherSpy.restore();
            createItem.restore();
            addUnserializedModel.restore();
            getModelByAddress.restore();
            addUnserializedModel.restore();
        });
    });
});
