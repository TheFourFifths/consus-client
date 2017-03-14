import { assert } from "chai";
import sinon from 'sinon';
import ModelController from '../../../../.dist/controllers/pages/model';
import * as api from '../../../../.dist/lib/api-client';
import * as router from 'react-router';
import { Dispatcher } from 'consus-core/flux';

describe("ModelPageController", () => {
    describe("getModelAndItems", () => {
        let spy, dispatcherSpy, getModelAndItems;
        beforeEach(() => {
            router.hashHistory = {};
            spy = router.hashHistory.push = sinon.spy();

            dispatcherSpy = sinon.spy(Dispatcher, "handleAction");

            getModelAndItems = sinon.stub(api, "getModelAndItems");
        });

        it('Dispatches "MODEL_FOUND" and "ITEMS_RECEIVED" when called.', () => {
            let res = {model: "m8y123", items: []};

            getModelAndItems.returns(
                new Promise(resolve => {
                    resolve(res);
                })
            );

            return ModelController.getModelAndItems("m8y123").then(() => {
                assert.isTrue(dispatcherSpy.called);
                assert.lengthOf(dispatcherSpy.getCall(0).args, 2);
                assert.strictEqual(dispatcherSpy.getCall(0).args[0], "MODEL_FOUND");
                assert.strictEqual(dispatcherSpy.getCall(0).args[1], "m8y123");
                assert.lengthOf(dispatcherSpy.getCall(1).args, 2);
                assert.strictEqual(dispatcherSpy.getCall(1).args[0], "ITEMS_RECEIVED");
                assert.strictEqual(dispatcherSpy.getCall(1).args[1], res);
                assert.isTrue(spy.called);
                assert.strictEqual(spy.getCall(0).args.length, 1);
                assert.strictEqual(spy.getCall(0).args[0], "/model");
            });
        });

        it('Dispatchers "ERROR" if model request comes back invalid', () => {
            getModelAndItems.returns(
                new Promise((resolve, reject) => {
                    reject("NO");
                })
            );

            return ModelController.getModelAndItems().then(() => {
                assert.isTrue(dispatcherSpy.called);
                assert.lengthOf(dispatcherSpy.getCall(0).args, 2);
                assert.strictEqual(dispatcherSpy.getCall(0).args[0], "ERROR");
                assert.strictEqual(dispatcherSpy.getCall(0).args[1].error, "The model requested does not exist");
            });
        });

        afterEach(() => {
            dispatcherSpy.restore();
            getModelAndItems.restore();
            Dispatcher.handleAction("CLEAR_ALL_DATA");
        });
    });
});
