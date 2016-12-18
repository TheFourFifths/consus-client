import { assert } from "chai";
import sinon from 'sinon';
import * as api from '../../../../.dist/lib/api-client';
import StudentPanelController from '../../../../.dist/controllers/components/student-panel';
import { Dispatcher } from 'consus-core/flux';

describe("StudentPanelController",() => {
    describe("getModels",() => {
        it("calls getAllModels", () => {
            let dispatcherSpy = sinon.spy(Dispatcher, "handleAction");
            let getAllModels = sinon.stub(api, "getAllModels");

            getAllModels.returns(
                new Promise(resolve => {
                    resolve({models:[]});
                })
            );

            return StudentPanelController.getModels().then(() => {
                assert.isTrue(dispatcherSpy.called);
                assert.lengthOf(dispatcherSpy.getCall(0).args, 2);
                assert.strictEqual(dispatcherSpy.getCall(0).args[0], "MODELS_RECEIVED");
                dispatcherSpy.restore();
                getAllModels.restore();
            });
        });
        after(() => {
            Dispatcher.handleAction("CLEAR_ALL_DATA");
        });
    });
});
