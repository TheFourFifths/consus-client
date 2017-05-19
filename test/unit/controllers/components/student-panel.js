import { assert } from "chai";
import sinon from 'sinon';
import * as api from '../../../../.dist/lib/api-client';
import StudentPanelController from '../../../../.dist/controllers/components/student-panel';
import { Dispatcher } from 'consus-core/flux';
import StudentStore from '../../../../.dist/store/student-store'
import moment from 'moment-timezone';

describe("StudentPanelController",() => {

    let dispatcherSpy, getAllModels, retrieveItem, retrieveModel, saveItem, saveModel, searchStudent;

    beforeEach(() => {
        Dispatcher.handleAction('STUDENT_FOUND', {
            id: 123456,
            name: 'Person',
            items: [{address: 'iGwEZUvfA'}],
            models: [{address: 'm8y7nEtAe'}]
        });
        dispatcherSpy = sinon.spy(Dispatcher, "handleAction");
        getAllModels = sinon.stub(api, "getAllModels");
        retrieveItem = sinon.stub(api, 'retrieveItem');
        retrieveModel = sinon.stub(api, 'retrieveModel');
        saveItem = sinon.stub(api, 'saveItem');
        saveModel = sinon.stub(api, 'saveModel');
        searchStudent = sinon.stub(api, 'searchStudent');
    });

    afterEach(() => {
        dispatcherSpy.restore();
        getAllModels.restore();
        retrieveItem.restore();
        retrieveModel.restore();
        saveItem.restore();
        saveModel.restore();
        searchStudent.restore();
        Dispatcher.handleAction("CLEAR_ALL_DATA");
    });

    it("getModels", () => {
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

    describe("countDuplicateModels",() => {
        it("accurately counts models", () => {
            let models = [{address: 1, name: 'one'}, {address: 2, name: 'two'}, {address: 3, name: 'three'}, {address: 1, name: 'one'}];

            assert.strictEqual(StudentPanelController.countDuplicateModels(models)[0].quantity, 2);
            assert.strictEqual(StudentPanelController.countDuplicateModels(models)[1].quantity, 1);
            assert.strictEqual(StudentPanelController.countDuplicateModels(models)[2].quantity, 1);
        });
    });

    describe("changeItemDueDate",() => {
        let isValidDueDate, patchItemDueDate, getStudent;

        beforeEach(() => {
            isValidDueDate = sinon.stub(StudentPanelController, "isValidDueDate");
            patchItemDueDate = sinon.stub(api, "patchItemDueDate");
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
            isValidDueDate.restore();
            searchStudent.restore();
            patchItemDueDate.restore();
            getStudent.restore();
            Dispatcher.handleAction("CLEAR_ALL_DATA");
        });
    });

    describe('isValidDueDate', () => {
        it('returns correct values', () => {
            let calendar = moment();
            calendar.add(10, 'd');
            assert.isTrue(StudentPanelController.isValidDueDate(calendar));
            calendar.add(-20, 'd');
            assert.isFalse(StudentPanelController.isValidDueDate(calendar));
        });
    });

    it("retrieveItem", () => {
        retrieveItem.returns(
            new Promise(resolve => {
                resolve({});
            })
        );
        return StudentPanelController.retrieveItem('iGwEZUvfA').then(() => {
            assert.isTrue(dispatcherSpy.called);
            assert.lengthOf(dispatcherSpy.getCall(0).args, 2);
            assert.strictEqual(dispatcherSpy.getCall(0).args[0], "RETRIEVE_ITEM");
            assert.deepEqual(dispatcherSpy.getCall(0).args[1], {
                itemAddress: 'iGwEZUvfA'
            });
        });
    });

    it("retrieveModel", () => {
        retrieveModel.returns(
            new Promise(resolve => {
                resolve({});
            })
        );
        return StudentPanelController.retrieveModel(123456, 'm8y7nEtAe').then(() => {
            assert.isTrue(dispatcherSpy.called);
            assert.lengthOf(dispatcherSpy.getCall(0).args, 2);
            assert.strictEqual(dispatcherSpy.getCall(0).args[0], "RETRIEVE_MODEL");
            assert.deepEqual(dispatcherSpy.getCall(0).args[1], {
                modelAddress: 'm8y7nEtAe'
            });
        });
    });

    it("saveItem", () => {
        saveItem.returns(
            new Promise(resolve => {
                resolve({});
            })
        );
        searchStudent.returns(
            new Promise(resolve => {
                resolve({
                    id: 123456,
                    name: 'John von Neumann',
                    items: []
                });
            })
        );
        return StudentPanelController.saveItem('iGwEZUvfA').then(() => {
            assert.isTrue(dispatcherSpy.called);
            assert.lengthOf(dispatcherSpy.getCall(0).args, 2);
            assert.strictEqual(dispatcherSpy.getCall(0).args[0], "SAVE_ITEM");
            assert.deepEqual(dispatcherSpy.getCall(0).args[1], {
                itemAddress: 'iGwEZUvfA'
            });
        });
    });

    it("saveModel", () => {
        saveModel.returns(
            new Promise(resolve => {
                resolve({});
            })
        );
        searchStudent.returns(
            new Promise(resolve => {
                resolve({
                    id: 123456,
                    name: 'John von Neumann',
                    items: []
                });
            })
        );
        return StudentPanelController.saveModel(123456, 'm8y7nEtAe').then(() => {
            assert.isTrue(dispatcherSpy.called);
            assert.lengthOf(dispatcherSpy.getCall(0).args, 2);
            assert.strictEqual(dispatcherSpy.getCall(0).args[0], "SAVE_MODEL");
            assert.deepEqual(dispatcherSpy.getCall(0).args[1], {
                modelAddress: 'm8y7nEtAe'
            });
        });
    });
});
