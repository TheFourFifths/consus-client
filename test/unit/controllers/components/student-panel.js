import { assert } from "chai";
import sinon from 'sinon';
import * as api from '../../../../.dist/lib/api-client';
import StudentPanelController from '../../../../.dist/controllers/components/student-panel';
import { Dispatcher } from 'consus-core/flux';
import StudentStore from '../../../../.dist/store/student-store';
import Moment from 'moment-timezone';
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

    describe("changeDueDate",() => {
        let dispatcherSpy, patchItemDueDate, studentStore;

        beforeEach(() => {
            dispatcherSpy = sinon.spy(Dispatcher, "handleAction");
            patchItemDueDate = sinon.stub(api, "patchItemDueDate");
            studentStore = sinon.stub(StudentStore, "getStudent");
        });

        it("calls patchItemDueDate", () => {
            patchItemDueDate.returns(
                new Promise(resolve => {
                    resolve({models:[]});
                })
            );
            studentStore.returns({
               id: 123456
            });
            let today = Moment.tz('America/Chicago');
            let item = {
                timestamp: today.format('X')
            };
            let newDate = today.add(1,'days');
            return StudentPanelController.changeDueDate(newDate, item).then(() => {
                assert.isTrue(dispatcherSpy.called);
                assert.lengthOf(dispatcherSpy.getCall(0).args, 2);
                assert.strictEqual(dispatcherSpy.getCall(0).args[0], "ITEM_DUEDATE_UPDATED");

            });
        });

        it("dispatches ERROR", () => {
            patchItemDueDate.returns(
                new Promise(resolve => {
                    resolve({models:[]});
                })
            );
            studentStore.returns({
                id: 123456
            });
            let today = Moment.tz('America/Chicago');
            let item = {
                timestamp: today.format('X')
            };
            let newDate = today.add(-1,'days');
            StudentPanelController.changeDueDate(newDate, item);
            assert.isTrue(dispatcherSpy.called);
            assert.lengthOf(dispatcherSpy.getCall(0).args, 2);
            assert.strictEqual(dispatcherSpy.getCall(0).args[0], "ERROR");
        });

        afterEach(() => {
            dispatcherSpy.restore();
            patchItemDueDate.restore();
            studentStore.restore();
            Dispatcher.handleAction("CLEAR_ALL_DATA");
        });
    });
});
