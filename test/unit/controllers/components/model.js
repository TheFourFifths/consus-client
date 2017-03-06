import { assert } from "chai";
import sinon from 'sinon';
import * as api from '../../../../.dist/lib/api-client';
import { Dispatcher } from 'consus-core/flux';
import ModelController from '../../../../.dist/controllers/components/model';

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

    describe.only('addItemToModel', () => {
        let dispatcherSpy, createItem;
        beforeEach(() => {
            dispatcherSpy = sinon.spy(Dispatcher, "handleAction");
            createItem = sinon.stub(api, "createItem");
        });

        it('Dispatches "ITEM_CREATED" when item is created for model', () => {
            let modelAddress = 'fake';
            createItem.returns(
                new Promise((resolve, reject) => {
                    resolve('nothing');
                })
            );

            return ModelController.addItemToModel(modelAddress).then(() => {
                assert.isTrue(dispatcherSpy.called);
                assert.strictEqual(dispatcherSpy.getCall(0).args.length, 2);
                assert.strictEqual(dispatcherSpy.getCall(0).args[0], "ITEM_CREATED");
            });
        });

        it('Dispatches "ERROR" when item is created for model', () => {
            let modelAddress = 'fake';
            createItem.returns(
                new Promise((resolve, reject) => {
                    reject('nothing');
                })
            );

            return ModelController.addItemToModel(modelAddress).then(() => {
                assert.isTrue(dispatcherSpy.called);
                assert.strictEqual(dispatcherSpy.getCall(0).args.length, 2);
                assert.strictEqual(dispatcherSpy.getCall(0).args[0], "ERROR");
            });
        });

        afterEach(() => {
            dispatcherSpy.restore();
            createItem.restore();
        });
    });
});
