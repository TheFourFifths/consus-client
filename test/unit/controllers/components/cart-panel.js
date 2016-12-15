import CartController from '../../../../.dist/controllers/components/cart-panel';
import { assert } from "chai";
import sinon from 'sinon';
import * as api from '../../../../.dist/lib/api-client';
import { Dispatcher } from 'consus-core/flux';

describe("CartController", () => {

    describe('checkInItem',()=> {

        beforeEach(() => {
            Dispatcher.handleAction("STUDENT_FOUND", {items: [{itemAddress: "123456"}]});
        });

        after(() => {
            Dispatcher.handleAction("CLEAR_ALL_DATA");
            Dispatcher.handleAction("CLEAR_ERROR");
        });

        it('Should dispatch "CHECKIN_SUCCESS" on success', () => {
            let checkIn = sinon.stub(api, "checkIn");
            let spy = sinon.spy(Dispatcher, "handleAction");

            checkIn.returns(
                new Promise(resolve => {
                    resolve({itemAddress: "123456"});
                })
            );


            return CartController.checkInItem('123456', '123456').then(() => {
                assert.isTrue(spy.called);
                assert.strictEqual(spy.getCall(0).args.length, 2);
                assert.strictEqual(spy.getCall(0).args[0], "CHECKIN_SUCCESS");

                checkIn.restore();
                spy.restore();
            });


        });

        it('Should dispatch "ERROR" on failure', ()=> {
            let checkIn = sinon.stub(api, "checkIn");
            let spy = sinon.spy(Dispatcher, "handleAction");

            checkIn.returns(
                new Promise((resolve, reject) => {
                    reject("Something Wrong");
                })
            );

            return CartController.checkInItem('123456', '123456').then(() => {
                assert.isTrue(spy.called);
                assert.strictEqual(spy.getCall(0).args.length, 2);
                assert.strictEqual(spy.getCall(0).args[0], "ERROR");
                assert.strictEqual(spy.getCall(0).args[1].error, 'Something Wrong');



                checkIn.restore();
                spy.restore();
            });
        });
    });

    describe('getItem',()=> {

        afterEach(() => {
            Dispatcher.handleAction("CLEAR_ALL_DATA");
            Dispatcher.handleAction("CLEAR_ERROR");
        });

        it('Should dispatch "CHECKOUT_ITEM_FOUND" on success', ()=> {
            Dispatcher.handleAction("STUDENT_FOUND", {items: [{itemAddress: "123456", timestamp:100000000000000}]});
            let searchItem = sinon.stub(api, "searchItem");
            let spy = sinon.spy(Dispatcher, "handleAction");

            searchItem.returns(
                new Promise(resolve => {
                    resolve({status: "AVAILABLE"});
                })
            );

            return CartController.getItem("123456").then(() => {
                assert.isTrue(spy.called);
                assert.strictEqual(spy.getCall(0).args.length, 2);
                assert.strictEqual(spy.getCall(0).args[0], "CHECKOUT_ITEM_FOUND");

                searchItem.restore();
                spy.restore();
            })
        });

        it('Should dispatch "ERROR" is student has overdue item', () => {
            Dispatcher.handleAction("STUDENT_FOUND", {items: [{itemAddress: "123456", timestamp:0}]});
            let searchItem = sinon.stub(api, "searchItem");
            let spy = sinon.spy(Dispatcher, "handleAction");

            searchItem.returns(
                new Promise(resolve => {
                    resolve({status: "AVAILABLE"});
                })
            );

            CartController.getItem("123456");
            assert.isTrue(spy.called);
            assert.strictEqual(spy.getCall(0).args.length, 2);
            assert.strictEqual(spy.getCall(0).args[0], "ERROR");
            assert.strictEqual(spy.getCall(0).args[1].error, 'Student has at least one overdue item.');

            searchItem.restore();
            spy.restore();
        });

        it('Should dispatch "ERROR" if item is checked out', () => {
            Dispatcher.handleAction("STUDENT_FOUND", {items: []});
            let searchItem = sinon.stub(api, "searchItem");
            let spy = sinon.spy(Dispatcher, "handleAction");

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
                assert.isTrue(spy.called);
                assert.strictEqual(spy.getCall(0).args.length, 2);
                assert.strictEqual(spy.getCall(0).args[0], "ERROR");
                assert.strictEqual(spy.getCall(0).args[1].error, 'This item is already checked out by another student.');

                searchItem.restore();
                spy.restore();
            });
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
            assert.strictEqual(spy.getCall(0).args[1].error, "bad thing");
        });

        after(() => {
            spy.restore();
            Dispatcher.handleAction("CLEAR_ERROR");
        });
    });

});
