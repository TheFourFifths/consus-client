import { assert } from "chai";
import sinon from 'sinon';
import * as api from '../../../../.dist/lib/api-client';
import StudentPanelController from '../../../../.dist/controllers/components/student-panel';
import { Dispatcher } from 'consus-core/flux';
import StudentStore from '../../../../.dist/store/student-store'
describe("StudentPanelController",() => {
    describe("getModels",() => {
        let dispatcherSpy, getAllModels;

        beforeEach(() => {
            dispatcherSpy = sinon.spy(Dispatcher, "handleAction");
            getAllModels = sinon.stub(api, "getAllModels");
        });

        it("calls getAllModels", () => {
            getAllModels.returns(
                new Promise(resolve => {
                    resolve({models:[]});
                })
            );

            return StudentPanelController.getModels().then(() => {
                assert.isTrue(dispatcherSpy.called);
                assert.lengthOf(dispatcherSpy.getCall(0).args, 2);
                assert.strictEqual(dispatcherSpy.getCall(0).args[0], "MODELS_RECEIVED");

            });
        });
        afterEach(() => {
            dispatcherSpy.restore();
            getAllModels.restore();
            Dispatcher.handleAction("CLEAR_ALL_DATA");
        });
    });

    describe("countDuplicateModels",() => {
        it("accurately counts models", () => {
            let models = [{address: 1, name: 'one'}, {address: 2, name: 'two'}, {address: 3, name: 'three'}, {address: 1, name: 'one'}];

            assert.strictEqual(StudentPanelController.countDuplicateModels(models)[0].quantity, 2);
            assert.strictEqual(StudentPanelController.countDuplicateModels(models)[1].quantity, 1);
            assert.strictEqual(StudentPanelController.countDuplicateModels(models)[2].quantity, 1);
        });
    });

    describe("changeItemDueDate",() => {
        let dispatcherSpy, getAllModels, isValidDueDate, patchItemDueDate, searchStudent, getStudent;

        beforeEach(() => {
            dispatcherSpy = sinon.spy(Dispatcher, "handleAction");
            getAllModels = sinon.stub(api, "getAllModels");
            isValidDueDate = sinon.stub(StudentPanelController, "isValidDueDate");
            patchItemDueDate = sinon.stub(api, "patchItemDueDate");
            searchStudent = sinon.stub(api, "searchStudent");
            getStudent = sinon.stub(StudentStore, "getStudent");
        });

        it("calls patchItemDueDate", () => {
            let today = new Date().toDateString();
            isValidDueDate.returns(true);
            searchStudent.returns(
                new Promise(resolve => {
                    resolve({items:[]});
                })
            );
            patchItemDueDate.returns(
                new Promise(resolve => {
                    resolve();
                })
            );
            getStudent.returns({id: 123456});
            StudentPanelController.changeItemDueDate(today, {address: 'address'}).then(() => {
                assert.isTrue(dispatcherSpy.called);
                assert.isTrue(isValidDueDate.called);
                assert.isTrue(patchItemDueDate.called);
                assert.isTrue(searchStudent.called);
                assert.isTrue(getStudent.called);
            });
        });

        it("handles patchItemDueDate error", () => {
            let today = new Date().toDateString();
            isValidDueDate.returns(true);
            patchItemDueDate.returns(
                new Promise( (resolve,reject) => {
                    reject("NOPE");
                })
            );
            getStudent.returns({id: 123456});
            StudentPanelController.changeItemDueDate(today, {address: 'address'}).then(() => {
                assert.isTrue(isValidDueDate.called);
                assert.isTrue(patchItemDueDate.called);
                assert.isTrue(getStudent.called);
                assert.strictEqual(dispatcherSpy.getCall(0).args.length, 2);
                assert.strictEqual(dispatcherSpy.getCall(0).args[0], "ERROR");
            });
        });

        afterEach(() => {
            dispatcherSpy.restore();
            getAllModels.restore();
            isValidDueDate.restore();
            searchStudent.restore();
            patchItemDueDate.restore();
            getStudent.restore();
            Dispatcher.handleAction("CLEAR_ALL_DATA");
        });
    });
});
