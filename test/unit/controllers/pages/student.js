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

        it('Dispatches nothing if the adminCode is length 0', () => {
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
        it('Dispatches "CLEAR_CART_CONTENTS" when called', () => {
            StudentController.cancelCheckout();
            assert.isTrue(dispatcherSpy.called);
            assert.strictEqual(dispatcherSpy.getCall(0).args[0], "CLEAR_CART_CONTENTS");
        });
    });

    describe("checkout",() => {
        let checkOutItems;
        beforeEach(() => {
            checkOutItems = sinon.stub(api, "checkOutContents");
        });

        it('Dispatches "CHECKOUT_SUCCESS" on success and refreshes student', () => {
            checkOutItems.returns(
                new Promise(resolve => {
                    resolve();
                })
            );

            let searchStudent = sinon.stub(api, "searchStudent");

            searchStudent.returns(
                new Promise(resolve => {
                    resolve({student:{items:[]}});
                })
            );

            return StudentController.checkout(123456, [{address: '123', quantity: 5}, {address: '456'}]).then(() => {
                assert.isTrue(dispatcherSpy.called);
                assert.strictEqual(dispatcherSpy.getCall(0).args[0], "CHECKOUT_SUCCESS");
                searchStudent.restore();
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

    describe("checkInModel", () => {
        let checkInModel;
        beforeEach(() => {
            Dispatcher.handleAction("STUDENT_FOUND", {items: [{modelAddress: '123'}]});
            checkInModel = sinon.stub(api, "checkInModel");
        });

        it('Dispatches "MODEL_CHECKIN_SUCCESS" on success and refreshes student', () => {
            checkInModel.returns(
                new Promise(resolve => {
                    resolve({
                        modelAddress: '123',
                        modelName: 'Resistor',
                        quantity: 4
                    });
                })
            );

            let searchStudent = sinon.stub(api, "searchStudent");

            searchStudent.returns(
                new Promise(resolve => {
                    resolve({
                        id: 123456,
                        name: 'John von Neumann',
                        status: 'C - Current',
                        email: 'neumannJ@msoe.edu',
                        major: 'Software Engineering',
                        items: [],
                        models: []
                    });
                })
            );

            return StudentController.checkInModel(123456, '123', 4).then(() => {
                assert.isTrue(dispatcherSpy.called);
                assert.strictEqual(dispatcherSpy.getCall(1).args[0], "MODEL_CHECKIN_SUCCESS");
                assert.strictEqual(dispatcherSpy.getCall(2).args[0], "STUDENT_FOUND");
                searchStudent.restore();
            });
        });

        it('Dispatches ERROR when checkin fails', () => {
            checkInModel.returns(
                new Promise((resolve, reject) => {
                    reject("NO");
                })
            );

            return StudentController.checkInModel(123456, '123', 4).then(() => {
                assert.isTrue(dispatcherSpy.called);
                assert.strictEqual(dispatcherSpy.getCall(1).args[0], "ERROR");
                assert.strictEqual(dispatcherSpy.getCall(1).args[1].error, "Model checkin has failed");
            });
        });

        afterEach(() => {
            dispatcherSpy.restore();
            checkInModel.restore();
        });
    });

    afterEach(() => {
        dispatcherSpy.restore();
        Dispatcher.handleAction("CLEAR_ALL_DATA");
        Dispatcher.handleAction("CLEAR_ERROR");
    });
});
