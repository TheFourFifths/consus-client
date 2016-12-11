import { assert } from "chai";
import sinon from 'sinon';
import * as api from '../../../../.dist/lib/api-client';
import * as router from 'react-router';
import { Dispatcher } from 'consus-core/flux';
import ItemController from '../../../../.dist/controllers/pages/items';

describe("ItemController", () => {
    describe("newItemPage", () => {
        let getAllModels, dispatcherSpy, spy;
        before(() => {
            router.hashHistory = {};
            spy = router.hashHistory.push = sinon.spy();

            dispatcherSpy = sinon.spy(Dispatcher, "handleAction");

            getAllModels = sinon.stub(api, "getAllModels");
        });


        it('Dispatches "MODELS_RECIEVED" and pushes "/items/new" to the hashHistory when models are received',() => {
            getAllModels.returns(
                new Promise(resolve => {
                    resolve({models:[]});
                })
            );

            return ItemController.newItemPage().then(() => {
                assert.isTrue(spy.called);
                assert.strictEqual(spy.getCall(0).args.length, 1);
                assert.strictEqual(spy.getCall(0).args[0], "/items/new");
                assert.isTrue(dispatcherSpy.called);
                assert.strictEqual(dispatcherSpy.getCall(0).args.length, 2);
                assert.strictEqual(dispatcherSpy.getCall(0).args[0], "MODELS_RECEIVED");
            });
        });



        after(() => {
            dispatcherSpy.restore();
            getAllModels.restore();
        });
    })
});
