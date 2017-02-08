import CartController from '../../../../.dist/controllers/components/cart-panel';
import { assert } from "chai";
import sinon from 'sinon';
import * as api from '../../../../.dist/lib/api-client';
import { Dispatcher } from 'consus-core/flux';

describe("CartController", () => {

    describe('checkInItem',()=> {
        let checkIn, dispatcherSpy;

        beforeEach(() => {
            Dispatcher.handleAction("STUDENT_FOUND", {items: [{itemAddress: "123456"}]});
            checkIn = sinon.stub(api, "checkIn");
            dispatcherSpy = sinon.spy(Dispatcher, "handleAction");
        });

        it('Should dispatch "CHECKIN_SUCCESS" on success', () => {
            checkIn.returns(
                new Promise(resolve => {
                    resolve({itemAddress: "123456"});
                })
            );
            return CartController.checkInItem('123456', '123456').then(() => {
                assert.isTrue(dispatcherSpy.called);
                assert.strictEqual(dispatcherSpy.getCall(0).args.length, 2);
                assert.strictEqual(dispatcherSpy.getCall(0).args[0], "CHECKIN_SUCCESS");
            });
        });

        it('Should dispatch "ERROR" on failure', ()=> {
            checkIn.returns(
                new Promise((resolve, reject) => {
                    reject("Something Wrong");
                })
            );
            return CartController.checkInItem('123456', '123456').then(() => {
                assert.isTrue(dispatcherSpy.called);
                assert.strictEqual(dispatcherSpy.getCall(0).args.length, 2);
                assert.strictEqual(dispatcherSpy.getCall(0).args[0], "ERROR");
                assert.strictEqual(dispatcherSpy.getCall(0).args[1].error, 'Something Wrong');
            });
        });

        afterEach(() => {
            checkIn.restore();
            dispatcherSpy.restore();
            Dispatcher.handleAction("CLEAR_ALL_DATA");
            Dispatcher.handleAction("CLEAR_ERROR");
        });
    });

    describe('getItem',()=> {
        let dispatcherSpy, searchItem;

        beforeEach(() => {
            Dispatcher.handleAction("STUDENT_FOUND", {items: [{itemAddress: "123456"}]});
            searchItem = sinon.stub(api, "searchItem");
            dispatcherSpy = sinon.spy(Dispatcher, "handleAction");
        });

        it('Should dispatch "CHECKOUT_ITEM_FOUND" on success', ()=> {
            Dispatcher.handleAction("STUDENT_FOUND", {items: [{itemAddress: "123456", timestamp:100000000000000}]});

            searchItem.returns(
                new Promise(resolve => {
                    resolve({status: "AVAILABLE"});
                })
            );
            return CartController.getItem("123456").then(() => {
                assert.isTrue(dispatcherSpy.called);
                assert.strictEqual(dispatcherSpy.getCall(1).args.length, 2);
                assert.strictEqual(dispatcherSpy.getCall(1).args[0], "CHECKOUT_ITEM_FOUND");
            })
        });

        it('Should dispatch "ERROR" if item is checked out', () => {
            Dispatcher.handleAction("STUDENT_FOUND", {items: []});
            searchItem.returns(
                new Promise(resolve => {
                    resolve({
                        "address": "iGwEZUvfA",
                        "modelAddress": "m8y7nEtAe",
                        "status": "CHECKED_OUT"
                    })
                })
            );

            return CartController.getItem("iGwEZUvfA").then(() => {
                assert.isTrue(dispatcherSpy.called);
                assert.strictEqual(dispatcherSpy.getCall(1).args.length, 2);
                assert.strictEqual(dispatcherSpy.getCall(1).args[0], "ERROR");
                assert.strictEqual(dispatcherSpy.getCall(1).args[1].error, 'This item is already checked out by another student.');
            });
        });

        afterEach(() => {
            searchItem.restore();
            dispatcherSpy.restore();
            Dispatcher.handleAction("CLEAR_ALL_DATA");
            Dispatcher.handleAction("CLEAR_ERROR");
        });
    });

    describe('getModel',()=> {
        let dispatcherSpy, searchModel;

        beforeEach(() => {
            Dispatcher.handleAction("STUDENT_FOUND", {items: [{itemAddress: "123456"}]});
            searchModel = sinon.stub(api, "searchModel");
            dispatcherSpy = sinon.spy(Dispatcher, "handleAction");
        });

        it('Should dispatch "CHECKOUT_MODEL_FOUND" on success', ()=> {
            Dispatcher.handleAction("STUDENT_FOUND", {items: [{itemAddress: "123456", timestamp:100000000000000}]});

            searchModel.returns(
                new Promise(resolve => {
                    resolve({
                        address: 123456,
                        allowCheckout: true,
                        inStock: 2
                    })
                })
            );
            return CartController.getModel("123456").then(() => {
                assert.isTrue(dispatcherSpy.called);
                assert.strictEqual(dispatcherSpy.getCall(1).args.length, 2);
                assert.strictEqual(dispatcherSpy.getCall(1).args[0], "CHECKOUT_MODEL_FOUND");
            })
        });

        it('Should dispatch "ERROR" if no models in stock', () => {
            Dispatcher.handleAction("STUDENT_FOUND", {items: []});
            searchModel.returns(
                new Promise(resolve => {
                    resolve({
                        name: "transistor",
                        address: 123456,
                        allowCheckout: true,
                        inStock: 0
                    })
                })
            );

            return CartController.getModel("123456").then(() => {
                assert.isTrue(dispatcherSpy.called);
                assert.strictEqual(dispatcherSpy.getCall(1).args.length, 2);
                assert.strictEqual(dispatcherSpy.getCall(1).args[0], "ERROR");
                assert.strictEqual(dispatcherSpy.getCall(1).args[1].error, 'transistor is out of stock.');
            });
        });

        it('Should dispatch "ERROR" if checkout is not allowed', () => {
            Dispatcher.handleAction("STUDENT_FOUND", {items: []});
            searchModel.returns(
                new Promise(resolve => {
                    resolve({
                        name: "transistor",
                        address: 123456,
                        allowCheckout: false,
                        inStock: 20
                    })
                })
            );

            return CartController.getModel("123456").then(() => {
                assert.isTrue(dispatcherSpy.called);
                assert.strictEqual(dispatcherSpy.getCall(1).args.length, 2);
                assert.strictEqual(dispatcherSpy.getCall(1).args[0], "ERROR");
                assert.strictEqual(dispatcherSpy.getCall(1).args[1].error, 'transistor is not available for checkout.');
            });
        });

        afterEach(() => {
            searchModel.restore();
            dispatcherSpy.restore();
            Dispatcher.handleAction("CLEAR_ALL_DATA");
            Dispatcher.handleAction("CLEAR_ERROR");
        });
    });

    describe('incrementModel',()=> {
        let dispatcherSpy, searchModel;

        beforeEach(() => {
            Dispatcher.handleAction("STUDENT_FOUND", {items: [{itemAddress: "123456"}]});
            Dispatcher.handleAction("CHECKOUT_MODEL_FOUND", {address:123456, allowCheckout: true, inStock: 2});
            searchModel = sinon.stub(api, "searchModel");
            dispatcherSpy = sinon.spy(Dispatcher, "handleAction");
        });

        it('Should dispatch "CHECKOUT_DUPLICATE_MODEL" on success', ()=> {

            searchModel.returns(
                new Promise(resolve => {
                    resolve({
                        address: 123456,
                        allowCheckout: true,
                        inStock: 2
                    })
                })
            );
            return CartController.incrementModel("123456").then(() => {
                assert.isTrue(dispatcherSpy.called);
                assert.strictEqual(dispatcherSpy.getCall(0).args.length, 2);
                assert.strictEqual(dispatcherSpy.getCall(0).args[0], "CHECKOUT_DUPLICATE_MODEL");
            });
        });

        afterEach(() => {
            searchModel.restore();
            dispatcherSpy.restore();
            Dispatcher.handleAction("CLEAR_ALL_DATA");
            Dispatcher.handleAction("CLEAR_ERROR");
        });
    });

    describe("throwError", () => {
        let spy;
        before(() => {
            spy = sinon.spy(Dispatcher, "handleAction");
        });

        it("Should throw the error that it's given", () => {
            CartController.throwError("bad thing");
            assert.isTrue(spy.called);
            assert.strictEqual(spy.getCall(0).args.length, 2);
            assert.strictEqual(spy.getCall(0).args[0], "ERROR");
        });

        after(() => {
            spy.restore();
            Dispatcher.handleAction("CLEAR_ERROR");
        });
    });

});
