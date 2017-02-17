import { assert } from "chai";
import sinon from 'sinon';
import * as api from '../../../../.dist/lib/api-client';
import { Dispatcher } from 'consus-core/flux';
import StudentPageController from '../../../../.dist/controllers/pages/students';

describe("StudentPageController", () => {
    let dispatcherSpy;
    beforeEach(() => {
        dispatcherSpy = sinon.spy(Dispatcher, "handleAction");
    });

    describe("getStudents",() => {
        let getStudents;
        beforeEach(() => {
            getStudents = sinon.stub(api, "getAllStudents");
        });

        it("Gets all students", () => {
            getStudents.returns(
                new Promise(resolve => {
                    resolve([{id: 123456, items:[]},{ id: 123456, items:[]}]);
                })
            );

            return StudentPageController.getStudents().then(() => {
                assert.isTrue(dispatcherSpy.called);
                assert.strictEqual(dispatcherSpy.getCall(0).args[0], "STUDENTS_FOUND");
                assert.lengthOf(dispatcherSpy.getCall(0).args[1], 2);
                getStudents.restore();
            });
        });
    });

    afterEach(() => {
        dispatcherSpy.restore();
        Dispatcher.handleAction("CLEAR_ALL_DATA");
        Dispatcher.handleAction("CLEAR_ERROR");
    });
});
