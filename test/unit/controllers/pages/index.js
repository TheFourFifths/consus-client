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

    describe("getStudents", () => {
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

            return IndexController.getStudents().then(() => {
                assert.isTrue(spy.called);
                assert.strictEqual(spy.getCall(0).args.length, 1);
                assert.strictEqual(spy.getCall(0).args[0], "/students");
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

    describe("getOverdueItems", () => {
        let routerSpy, dispatcherSpy, getOverdueItems, getAllModels;

        before(() => {
            router.hashHistory = {};
            routerSpy = router.hashHistory.push = sinon.spy();
            dispatcherSpy = sinon.spy(Dispatcher, "handleAction");
            getOverdueItems = sinon.stub(api, "getOverdueItems");
            getAllModels = sinon.stub(api, "getAllModels");
        });


        it('Dispatches "OVERDUE_ITEMS_RECEIVED" and pushes "/overdue" to hashHistory when items are received', () => {
            getAllModels.returns(
                new Promise(resolve => {
                    resolve({
                        models:[]
                    })
                })
            );

            getOverdueItems.returns(
                new Promise(resolve => {
                    resolve({
                        items:[]
                    });
                })
            );

            return IndexController.getOverdueItems().then(() => {
                assert.isTrue(routerSpy.called);
                assert.isTrue(dispatcherSpy.called);
                assert.lengthOf(routerSpy.getCall(0).args, 1);
                assert.strictEqual(routerSpy.getCall(0).args[0], "/overdue");
                assert.lengthOf(dispatcherSpy.getCall(0).args, 2);
                assert.strictEqual(dispatcherSpy.getCall(0).args[0], "MODELS_RECEIVED");
                assert.lengthOf(dispatcherSpy.getCall(1).args, 2);
                assert.strictEqual(dispatcherSpy.getCall(1).args[0], "OVERDUE_ITEMS_RECEIVED");

            });
        });

        after(() => {
            dispatcherSpy.restore();
            getOverdueItems.restore();
            getAllModels.restore();
        });
    });

});
