import { assert } from "chai";
import sinon from 'sinon';
import * as api from '../../../../.dist/lib/api-client';
import StudentController from '../../../../.dist/controllers/components/student';
import { Dispatcher } from 'consus-core/flux';

describe("StudentController", () => {

    describe("updateStudent", () => {
        let dispatcherSpy, updateStudent;
        beforeEach(() => {
            dispatcherSpy = sinon.spy(Dispatcher, "handleAction");
            updateStudent = sinon.stub(api, "updateStudent");
        });

        it("Calls 'updateStudent' and dispatches STUDENT_UPDATED", () => {
            updateStudent.returns(
                new Promise(resolve => {
                    resolve({
                        id: 111111
                    });
                })
            );

            return StudentController.updateStudent({}).then(() => {
                assert.isTrue(dispatcherSpy.called);
                assert.lengthOf(dispatcherSpy.getCall(0).args, 2);
                assert.strictEqual(dispatcherSpy.getCall(0).args[0], "STUDENT_UPDATED");
                assert.deepEqual(dispatcherSpy.getCall(0).args[1], {
                    id: 111111
                });
            });
        });

        afterEach(() => {
            dispatcherSpy.restore();
            updateStudent.restore();
            Dispatcher.handleAction("CLEAR_ALL_DATA");
        });
    })
});
