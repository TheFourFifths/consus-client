import { assert } from "chai";
import sinon from 'sinon';
import * as api from '../../../../.dist/lib/api-client';
import * as router from 'react-router';
import { Dispatcher } from 'consus-core/flux';
import IndexController from '../../../../.dist/controllers/pages/index';

describe("IndexController", () => {

    describe("getItems", () => {
        let getAllItems, dispatcherSpy, spy;
        before(() => {
            router.hashHistory = {};
            spy = router.hashHistory.push = sinon.spy();

            dispatcherSpy = sinon.spy(Dispatcher, "handleAction");

            getAllItems = sinon.stub(api, "getAllItems");
        });


        it('Dispatches "ITEMS_RECIEVED" and pushes "/items" to the hashHistory when items are received',() => {
            getAllItems.returns(
                new Promise(resolve => {
                    resolve({items:[]});
                })
            );

            return IndexController.getItems().then(() => {
                assert.isTrue(spy.called);
                assert.strictEqual(spy.getCall(0).args.length, 1);
                assert.strictEqual(spy.getCall(0).args[0], "/items");
                assert.isTrue(dispatcherSpy.called);
                assert.strictEqual(dispatcherSpy.getCall(0).args.length, 2);
                assert.strictEqual(dispatcherSpy.getCall(0).args[0], "ITEMS_RECEIVED");
            });
        });



        after(() => {
            dispatcherSpy.restore();
            getAllItems.restore();
        });
    });

    describe("getModels", () => {
        let getAllModels, dispatcherSpy, spy;
        before(() => {
            router.hashHistory = {};
            spy = router.hashHistory.push = sinon.spy();

            dispatcherSpy = sinon.spy(Dispatcher, "handleAction");

            getAllModels = sinon.stub(api, "getAllModels");
        });


        it('Dispatches "MODELS_RECIEVED" and pushes "/models" to the hashHistory when models are received',() => {
            getAllModels.returns(
                new Promise(resolve => {
                    resolve({models:[]});
                })
            );

            return IndexController.getModels().then(() => {
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