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

    describe("getStudent", () => {
        let dispatcherSpy, getItems, checkout, searchStudent, hashHistorySpy;
        beforeEach(() => {
            dispatcherSpy = sinon.spy(Dispatcher, "handleAction");
            getItems = sinon.stub(CartStore, "getItems");
            checkout = sinon.stub(StudentController, "checkout");
            searchStudent = sinon.stub(api, "searchStudent");
            router.hashHistory = {};
            hashHistorySpy = router.hashHistory.push = sinon.spy();
        });

        it('Checks out item if in cart', () => {
            getItems.onFirstCall().returns([items[0]]);
            getItems.onSecondCall().returns([items[0]]);
            getItems.returns([]);
            checkout.returns(new Promise(resolve => {
                resolve({status:"AVAILABLE"});
            }));
            searchStudent.returns(new Promise(resolve => {
                resolve({items:[]});
            }));
            return OmnibarController.getStudent(123456).then(() => {
                assert.isTrue(hashHistorySpy.called, 'Hashhistory not called');
                assert.isTrue(dispatcherSpy.called, 'dispatcher not called');
                assert.isTrue(getItems.called, 'getItems not called');
                assert.isTrue(checkout.called, 'checkout not called');
                assert.isTrue(searchStudent.called, 'searchStudent not called');
            });

        });

        it('getsStudent', () => {
            getItems.returns([]);
            searchStudent.returns(new Promise(resolve => {
                resolve({items:[]});
            }));
            return OmnibarController.getStudent(123456).then(() => {
                assert.isTrue(hashHistorySpy.called, 'Hashhistory not called');
                assert.isTrue(dispatcherSpy.called, 'dispatcher not called');
                assert.isTrue(getItems.called, 'getItems not called');
                assert.isTrue(searchStudent.called, 'searchStudent not called');
            });

        });
        afterEach(() => {
            dispatcherSpy.restore();
            getItems.restore();
            checkout.restore();
            searchStudent.restore();
            Dispatcher.handleAction("CLEAR_ERROR");
        });
    });


    describe("navigateToIndex", () => {
        let dispatcherSpy, getItems, checkout, getStudent, hashHistorySpy;

        beforeEach(() => {
            dispatcherSpy = sinon.spy(Dispatcher, "handleAction");
            getItems = sinon.stub(CartStore, "getItems");
            checkout = sinon.stub(StudentController, "checkout");
            getStudent = sinon.stub(StudentStore, "getStudent");
            router.hashHistory = {};
            hashHistorySpy = router.hashHistory.push = sinon.spy();
        });

        it('Items in cart', () => {
            getItems.returns([items[0]]);
            checkout.returns(new Promise(resolve => {
                resolve({status:"AVAILABLE"});
            }));
            getStudent.returns({items:[]});
            return OmnibarController.navigateToIndex().then(() => {
                assert.isTrue(hashHistorySpy.called, 'Hashhistory not called');
                assert.isTrue(getItems.called, 'getItems not called');
                assert.isTrue(checkout.called, 'checkout not called');
                assert.isTrue(getStudent.called, 'getStudent not called');
            });

        });

        it('No student in store', () => {
            getItems.returns([]);
            OmnibarController.navigateToIndex();
            assert.isTrue(hashHistorySpy.called, 'Hashhistory not called');

        });
        afterEach(() => {
            dispatcherSpy.restore();
            getItems.restore();
            checkout.restore();
            getStudent.restore();
            Dispatcher.handleAction("CLEAR_ERROR");
        });
    });

});
