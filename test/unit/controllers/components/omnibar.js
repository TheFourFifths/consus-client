import { assert } from "chai";
import sinon from 'sinon';
import * as api from '../../../../.dist/lib/api-client';
import * as router from 'react-router';
import { Dispatcher } from 'consus-core/flux';
import OmnibarController from '../../../../.dist/controllers/components/omnibar';
import CartStore from '../../../../.dist/store/cart-store';
import items from '../../../test-cases/items';
import students from '../../../test-cases/students';
import StudentController from '../../../../.dist/controllers/pages/student';
import StudentStore from '../../../../.dist/store/student-store';
describe("OmnibarController", () => {

    describe('setWarnBeforeExiting/getWarning', () => {
        it("Initializes warning to false", () => {
            assert.isFalse(OmnibarController.getWarning());
        });

        it("Can set the warning", () => {
            OmnibarController.setWarnBeforeExiting(true);
            assert.isTrue(OmnibarController.getWarning());
            OmnibarController.setWarnBeforeExiting(false);
            assert.isFalse(OmnibarController.getWarning());
        });
    });

    describe('leavePage', () => {
        let hashHistorySpy;
        beforeEach(() => {
            router.hashHistory = {};
            hashHistorySpy = router.hashHistory.push = sinon.spy();
        });

        it('pushes "/" to hashHistory', () => {
            OmnibarController.leavePage('/');
            assert.isTrue(hashHistorySpy.called);
            assert.lengthOf(hashHistorySpy.getCall(0).args, 1);
            assert.strictEqual(hashHistorySpy.getCall(0).args[0], "/");
        });
    });

    describe("getStudent",() => {
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

    describe("displayItem", () => {
        let dispatcherSpy, searchItem;
        beforeEach(() => {
            dispatcherSpy = sinon.spy(Dispatcher, "handleAction");
            searchItem = sinon.stub(api, "searchItem");
        });

        it('Redirects if given an item address', () => {
            let historySpy = router.hashHistory.push = sinon.spy();
            searchItem.returns(
                new Promise (resolve => {
                    resolve({
                        "address": "iGwEZUvfA",
                        "modelAddress": "m8y7nEtAe",
                        "status": "CHECKED_OUT"
                    });
                })
            );
            let itemAddress = 'iGwEZUvfA';

            return OmnibarController.displayItem(itemAddress).then(() => {
                assert.isTrue(historySpy.called);
                assert.strictEqual(historySpy.getCall(0).args.length, 1);
                assert.strictEqual(historySpy.getCall(0).args[0], "/item/" + itemAddress);
            });
        });

        it('Dispatches "ERROR" if address is of a model', () => {
            OmnibarController.displayItem('m8y7nEtAe');
            assert.isTrue(dispatcherSpy.called);
            assert.strictEqual(dispatcherSpy.getCall(0).args.length, 2);
            assert.strictEqual(dispatcherSpy.getCall(0).args[0], "ERROR");
            assert.strictEqual(dispatcherSpy.getCall(0).args[1].error, "Expected an item address but received a model address");
        });

        it('Dispatches "ERROR" if address is invalid', () => {
            OmnibarController.displayItem('igggggggg');
            assert.isTrue(dispatcherSpy.called);
            assert.strictEqual(dispatcherSpy.getCall(0).args.length, 2);
            assert.strictEqual(dispatcherSpy.getCall(0).args[0], "ERROR");
            assert.strictEqual(dispatcherSpy.getCall(0).args[1].error, "The provided item address is somehow invalid.");
        });

        afterEach(() => {
            dispatcherSpy.restore();
            searchItem.restore();
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

    describe("getStudent alternate flows", () => {
        let dispatcherSpy, getContents, checkout, searchStudent, hashHistorySpy,
            getIsLongterm, isValidLongtermData, longtermCheckout, getStudent;

        beforeEach(() => {
            dispatcherSpy = sinon.spy(Dispatcher, "handleAction");
            getContents = sinon.stub(CartStore, "getContents");
            checkout = sinon.stub(StudentController, "checkout");
            getIsLongterm = sinon.stub(CartStore, "getIsLongterm");
            isValidLongtermData = sinon.stub(StudentController, "isValidLongtermData");
            longtermCheckout = sinon.stub(StudentController, "longtermCheckout");
            searchStudent = sinon.stub(api, "searchStudent");
            router.hashHistory = {};
            hashHistorySpy = router.hashHistory.push = sinon.spy();
        });

        it('Checks out item if in cart', () => {
            getContents.onFirstCall().returns([items[0]]);
            getContents.onSecondCall().returns([items[0]]);
            getContents.returns([]);
            checkout.returns(new Promise(resolve => {
                resolve({status:"AVAILABLE"});
            }));
            searchStudent.returns(new Promise(resolve => {
                resolve({items:[]});
            }));
            return OmnibarController.getStudent(123456).then(() => {
                assert.isTrue(hashHistorySpy.called, 'Hashhistory not called');
                assert.isTrue(dispatcherSpy.called, 'dispatcher not called');
                assert.isTrue(getContents.called, 'getContents not called');
                assert.isTrue(checkout.called, 'checkout not called');
                assert.isTrue(searchStudent.called, 'searchStudent not called');
            });

        });

        it('getsStudent', () => {
            getContents.returns([]);
            searchStudent.returns(new Promise(resolve => {
                resolve({items:[]});
            }));
            return OmnibarController.getStudent(123456).then(() => {
                assert.isTrue(hashHistorySpy.called, 'Hashhistory not called');
                assert.isTrue(dispatcherSpy.called, 'dispatcher not called');
                assert.isTrue(getContents.called, 'getContents not called');
                assert.isTrue(searchStudent.called, 'searchStudent not called');
            });

        });

        it('Does a longterm checkout', () => {
            let getStudent = sinon.stub(StudentStore, "getStudent");
            getStudent.returns({id: 123456});
            getIsLongterm.returns(true);
            isValidLongtermData.returns(true);
            longtermCheckout.returns(new Promise(resolve => {
                resolve({status:"AVAILABLE"});
            }));
            getContents.onFirstCall().returns([items[0]]);
            getContents.onSecondCall().returns([items[0]]);
            getContents.returns([]);
            searchStudent.returns(new Promise(resolve => {
                resolve({items:[]});
            }));
            return OmnibarController.getStudent(123456).then(() => {
                getStudent.restore();
                assert.isTrue(hashHistorySpy.called, 'Hashhistory not called');
                assert.isTrue(dispatcherSpy.called, 'dispatcher not called');
                assert.isTrue(getContents.called, 'getContents not called');
                assert.isTrue(searchStudent.called, 'searchStudent not called');
                assert.isTrue(getIsLongterm.called, 'getIsLongterm not called');
                assert.isTrue(isValidLongtermData.called, 'isValidLongtermData not called');
                assert.isTrue(longtermCheckout.called, 'longtermCheckout not called');
            });
        });

        afterEach(() => {
            dispatcherSpy.restore();
            getContents.restore();
            checkout.restore();
            searchStudent.restore();
            longtermCheckout.restore();
            getIsLongterm.restore();
            isValidLongtermData.restore();
            Dispatcher.handleAction("CLEAR_ERROR");
        });
    });


    describe("navigateToIndex", () => {
        let dispatcherSpy, getContents, checkout, getStudent, hashHistorySpy;

        beforeEach(() => {
            dispatcherSpy = sinon.spy(Dispatcher, "handleAction");
            getContents = sinon.stub(CartStore, "getContents");
            checkout = sinon.stub(StudentController, "checkout");
            getStudent = sinon.stub(StudentStore, "getStudent");
            router.hashHistory = {};
            hashHistorySpy = router.hashHistory.push = sinon.spy();
        });

        it('Items in cart', () => {
            getContents.returns([items[0]]);
            checkout.returns(new Promise(resolve => {
                resolve({status:"AVAILABLE"});
            }));
            getStudent.returns({items:[]});
            assert.isTrue(OmnibarController.emptyCart());
            assert.isTrue(getContents.called, 'getContents not called');
            assert.isTrue(checkout.called, 'checkout not called');
            assert.isTrue(getStudent.called, 'getStudent not called');
        });

        it('No student in store', () => {
            getContents.returns([]);
            OmnibarController.emptyCart();
            assert.isFalse(hashHistorySpy.called, 'Hashhistory not called');
            assert.isFalse(checkout.called, 'checkout not called');

        });
        afterEach(() => {
            dispatcherSpy.restore();
            getContents.restore();
            checkout.restore();
            getStudent.restore();
            Dispatcher.handleAction("CLEAR_ERROR");
        });
    });
    describe('emptyCart', () => {
        let dispatcherSpy, getContents, getIsLongTerm, checkout, getStudent,
            hashHistorySpy, longtermCheckout, getDueDateSpy, getProfessorSpy, isValidLongtermData;

        beforeEach(() => {
            dispatcherSpy = sinon.spy(Dispatcher, "handleAction");
            getDueDateSpy = sinon.spy(CartStore, "getDueDate");
            getProfessorSpy = sinon.spy(CartStore, "getProfessor");
            getContents = sinon.stub(CartStore, "getContents");
            getIsLongTerm = sinon.stub(CartStore, "getIsLongterm");
            checkout = sinon.stub(StudentController, "checkout");
            longtermCheckout = sinon.stub(StudentController, "longtermCheckout");
            getStudent = sinon.stub(StudentStore, "getStudent");
            isValidLongtermData = sinon.stub(StudentController, 'isValidLongtermData');
            router.hashHistory = {};
            hashHistorySpy = router.hashHistory.push = sinon.spy();
        });

        describe('Items in cart', () => {

            it('Normal checkout', () => {
                getContents.returns([items[0]]);
                checkout.returns(new Promise(resolve => {
                    resolve({status:"AVAILABLE"});
                }));
                getIsLongTerm.returns(false);
                getStudent.returns({items:[]});
                assert.isTrue(OmnibarController.emptyCart());
                assert.isTrue(getContents.called, 'getContents not called');
                assert.isTrue(checkout.called, 'checkout not called');
                assert.isTrue(getStudent.called, 'getStudent not called');
            });
            it('Checkout is longterm', () => {
                getContents.returns([items[0]]);
                longtermCheckout.returns(new Promise(resolve => {
                    resolve({status:"AVAILABLE"});
                }));
                getIsLongTerm.returns(true);
                isValidLongtermData.returns(true);
                getStudent.returns({items:[]});
                assert.isTrue(OmnibarController.emptyCart());
                assert.isTrue(getContents.called, 'getContents not called');
                assert.isTrue(longtermCheckout.called, 'checkout not called');
                assert.isTrue(getStudent.called, 'getStudent not called');
                assert.isTrue(getDueDateSpy.called, 'getDueDateSpy not called');
                assert.isTrue(getProfessorSpy.called, 'getProfessorSpy not called');
            });
            it('longterm data is invalid', () => {
                getContents.returns([items[0]]);
                getIsLongTerm.returns(true);
                getStudent.returns({items:[]});
                isValidLongtermData.returns(false);
                assert.isFalse(OmnibarController.emptyCart());
                assert.isTrue(getContents.called, 'getContents not called');
                assert.isTrue(getIsLongTerm.called, 'getIsLongTerm not called');
                assert.isFalse(longtermCheckout.called, 'checkout not called');
                assert.isFalse(getStudent.called, 'getStudent not called');
                assert.isTrue(getDueDateSpy.called, 'getDueDateSpy not called');
                assert.isTrue(getProfessorSpy.called, 'getProfessorSpy not called');
            });


        });

        it('No student in store', () => {
            getContents.returns([]);
            OmnibarController.emptyCart();
            assert.isFalse(hashHistorySpy.called, 'Hashhistory not called');
            assert.isFalse(checkout.called, 'checkout not called');

        });
        afterEach(() => {
            dispatcherSpy.restore();
            getContents.restore();
            checkout.restore();
            getStudent.restore();
            longtermCheckout.restore();
            getDueDateSpy.restore();
            getProfessorSpy.restore();
            getIsLongTerm.restore();
            isValidLongtermData.restore();
            Dispatcher.handleAction("CLEAR_ERROR");
        });
    });

});
