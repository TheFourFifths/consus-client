import { assert } from "chai";
import sinon from 'sinon';
import * as api from '../../../../.dist/lib/api-client';
import * as router from 'react-router';
import { Dispatcher } from 'consus-core/flux';
import OmnibarController from '../../../../.dist/controllers/components/omnibar';
import CartStore from '../../../../.dist/store/cart-store';
import items from '../../../test-cases/items';

describe("OmnibarController", () => {
    describe("getOmnibar",() => {
        let hashHistorySpy, dispatcherSpy, searchStudent;
        beforeEach(() => {
            dispatcherSpy = sinon.spy(Dispatcher, "handleAction");
            searchStudent = sinon.stub(api, "searchStudent");
            router.hashHistory = {};
            hashHistorySpy = router.hashHistory.push = sinon.spy();
        });

        it('Dispatches "STUDENT_FOUND" when student is found',()=>{

            searchStudent.returns(
                new Promise(resolve => {
                    resolve({items:[]});
                })
            );

            return OmnibarController.getStudent("12kl3").then(() => {
                assert.isTrue(dispatcherSpy.called);
                assert.strictEqual(dispatcherSpy.getCall(0).args.length, 2);
                assert.strictEqual(dispatcherSpy.getCall(0).args[0], "STUDENT_FOUND");
                assert.isTrue(hashHistorySpy.called);
                assert.strictEqual(hashHistorySpy.getCall(0).args.length, 1);
                assert.strictEqual(hashHistorySpy.getCall(0).args[0], "/student");
            });

        });

        it('Dispatches "ERROR" when student is not found',()=>{

            searchStudent.returns(
                new Promise( (resolve,reject) => {
                    reject("NOPE");
                })
            );

            return OmnibarController.getStudent("12kl3").then(() => {
                assert.isTrue(dispatcherSpy.called);
                assert.strictEqual(dispatcherSpy.getCall(0).args.length, 2);
                assert.strictEqual(dispatcherSpy.getCall(0).args[0], "ERROR");
            });

        });

        afterEach(() => {
            dispatcherSpy.restore();
            searchStudent.restore();
            Dispatcher.handleAction("CLEAR_ERROR");
        });
    });

    describe("throwInvalidCharacterError", () => {
        let dispatcherSpy;
        beforeEach(() => {
            dispatcherSpy = sinon.spy(Dispatcher, "handleAction");
        });

        it('Dispatches "ERROR" when called', () => {
            OmnibarController.throwInvalidCharacterError();
            assert.isTrue(dispatcherSpy.called);
            assert.strictEqual(dispatcherSpy.getCall(0).args.length, 2);
            assert.strictEqual(dispatcherSpy.getCall(0).args[0], "ERROR");
            assert.strictEqual(dispatcherSpy.getCall(0).args[1].error, "Please only enter Alphanumeric Characters.");
        });

        afterEach(() => {
            dispatcherSpy.restore();
            Dispatcher.handleAction("CLEAR_ERROR");
        });
    });

    describe("getStudent Cart has item", () => {
        let dispatcherSpy, getItems;
        beforeEach(() => {
            dispatcherSpy = sinon.spy(Dispatcher, "handleAction");
            getItems = sinon.spy(CartStore, "getItems")
        });

        it.only('Dispatches "ERROR" when called', () => {
            getItems.returns(items[0]);
            OmnibarController.getStudent(123456);
            assert.isTrue(dispatcherSpy.called);
            assert.isTrue(getItems.called);
        });

        afterEach(() => {
            dispatcherSpy.restore();
            getItems.restore();
            Dispatcher.handleAction("CLEAR_ERROR");
        });
    });
});
