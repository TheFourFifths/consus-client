import { assert } from "chai";
import sinon from 'sinon';
import * as api from '../../../../.dist/lib/api-client';
import * as router from 'react-router';
import { Dispatcher } from 'consus-core/flux';
import CurrentlyCheckedOutReportPageController from '../../../../.dist/controllers/reports/currently-checked-out';

describe("CurrentlyCheckedOutReportPageController", () => {
    describe("getAllItems", () => {
        let dispatcherSpy, getAllItems, getAllModels, getAllStudents;

        before(() => {
            dispatcherSpy = sinon.spy(Dispatcher, "handleAction");
            getAllItems = sinon.stub(api, "getAllItems");
            getAllModels = sinon.stub(api, "getAllModels");
            getAllStudents = sinon.stub(api, "getAllStudents");
        });


        it('Dispatches "ITEMS_RECEIVED" when items are received', () => {
            getAllModels.returns(
                new Promise(resolve => {
                    resolve({
                        models:[]
                    })
                })
            );

            getAllItems.returns(
                new Promise(resolve => {
                    resolve({
                        items:[]
                    });
                })
            );

            getAllStudents.returns(
                new Promise(resolve => {
                    resolve([]);
                })
            )

            return CurrentlyCheckedOutReportPageController.getAllItems().then(() => {
                assert.isTrue(dispatcherSpy.called);
                assert.lengthOf(dispatcherSpy.getCall(0).args, 2);
                assert.strictEqual(dispatcherSpy.getCall(0).args[0], "MODELS_RECEIVED");
                assert.lengthOf(dispatcherSpy.getCall(1).args, 2);
                assert.strictEqual(dispatcherSpy.getCall(1).args[0], "STUDENTS_FOUND");
                assert.lengthOf(dispatcherSpy.getCall(2).args, 2);
                assert.strictEqual(dispatcherSpy.getCall(2).args[0], "ITEMS_RECEIVED");

            });
        });

        after(() => {
            dispatcherSpy.restore();
            getAllItems.restore();
            getAllModels.restore();
            getAllStudents.restore();
        });
    });

});
