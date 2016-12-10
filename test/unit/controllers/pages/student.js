import { assert } from "chai";
import sinon from 'sinon';
import * as api from '../../../../.dist/lib/api-client';
import { Dispatcher } from 'consus-core/flux';
import StudentController from '../../../../.dist/controllers/pages/student';

describe("StudentController", () => {
    let dispatcherSpy;
    beforeEach(() => {
        dispatcherSpy = sinon.spy(Dispatcher, "handleAction");
    });

    describe("acceptAdminModal", () => {
        it('Dispatches "ADMIN_CODE_ENTERED" when code is of non-zero length', () => {
            StudentController.acceptAdminModal("1");
            assert.isTrue(dispatcherSpy.called);
            assert.strictEqual(dispatcherSpy.getCall(0).args[0], "ADMIN_CODE_ENTERED");
            assert.strictEqual(dispatcherSpy.getCall(0).args[1].adminCode, "1");
        });

        it('Dispatches nothing is the adminCode is length 0', () => {
            StudentController.acceptAdminModal("");
            assert.isFalse(dispatcherSpy.called);
        });
    });

    describe("cancelAdminModal", () => {
        it('Dispatches "CLEAR_ADMIN_WINDOW" when called', () => {
            StudentController.cancelAdminModal();
            assert.isTrue(dispatcherSpy.called);
            assert.strictEqual(dispatcherSpy.getCall(0).args[0], "CLEAR_ADMIN_WINDOW");
        });
    });

    describe("cancelCheckout", () => {
        it('Dispatches "CLEAR_ITEMS" when called', () => {
            StudentController.cancelCheckout();
            assert.isTrue(dispatcherSpy.called);
            assert.strictEqual(dispatcherSpy.getCall(0).args[0], "CLEAR_ITEMS");
        });
    });

    describe("checkout",() => {
        let checkOutItems;
        beforeEach(() => {
            checkOutItems = sinon.stub(api, "checkOutItems");
        });

        it('Dispatches "CHECKOUT_SUCCESS" on success', () => {
            checkOutItems.returns(
                new Promise(resolve => {
                    resolve();
                })
            );

            return StudentController.checkout().then(() => {
                assert.isTrue(dispatcherSpy.called);
                assert.strictEqual(dispatcherSpy.getCall(0).args[0], "CHECKOUT_SUCCESS");
            });
        });

        it('Dispatches "OVERRIDE_REQUIRED" if student has overdue item', () => {
            checkOutItems.returns(
                new Promise((resolve, reject) => {
                    reject("Student has overdue item");
                })
            );

            return StudentController.checkout().then(() => {
                assert.isTrue(dispatcherSpy.called);
                assert.strictEqual(dispatcherSpy.getCall(0).args[0], "OVERRIDE_REQUIRED");
                Dispatcher.handleAction("CLEAR_ERROR");
            });
        });

        it('Dispatches "CLEAR_ADMIN_CODE" if admin is invalid', () => {
            checkOutItems.returns(
                new Promise((resolve, reject) => {
                    reject("Invalid Admin");
                })
            );

            return StudentController.checkout().then(() => {
                assert.isTrue(dispatcherSpy.called);
                assert.strictEqual(dispatcherSpy.getCall(0).args[0], "CLEAR_ADMIN_CODE");
                Dispatcher.handleAction("CLEAR_ERROR");
            });
        });

        it('Dispatches "ERROR" if another error comes up', () => {
            checkOutItems.returns(
                new Promise((resolve, reject) => {
                    reject("NO");
                })
            );

            return StudentController.checkout().then(() => {
                assert.isTrue(dispatcherSpy.called);
                assert.strictEqual(dispatcherSpy.getCall(0).args[0], "ERROR");
                assert.strictEqual(dispatcherSpy.getCall(0).args[1].error, "NO");
                Dispatcher.handleAction("CLEAR_ERROR");
            });
        });

        afterEach(() => {
            checkOutItems.restore();
        });
    });

    describe("throwNoItemsError", () => {
        it('Dispatches "ERROR" when called', () => {
            StudentController.throwNoItemsError();
            assert.isTrue(dispatcherSpy.called);
            assert.strictEqual(dispatcherSpy.getCall(0).args[0], "ERROR");
            assert.strictEqual(dispatcherSpy.getCall(0).args[1].error, "No Items were scanned for checkout.");
            Dispatcher.handleAction("CLEAR_ERROR");

        });
    });

    afterEach(() => {
        dispatcherSpy.restore();
        Dispatcher.handleAction("CLEAR_ALL_DATA");
        Dispatcher.handleAction("CLEAR_ERROR");
    });
});
