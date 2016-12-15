import { assert } from "chai";
import sinon from 'sinon';
import * as api from '../../../../.dist/lib/api-client';
import StudentPanelController from '../../../../.dist/controllers/components/student-panel';
import { Dispatcher } from 'consus-core/flux';

describe("StudentPanelController",() => {
    describe("getModels",() => {
        it("calls getAllModels", () => {
            let spy = sinon.spy(api, "getAllModels");
            StudentPanelController.getModels();
            assert.isTrue(spy.called);
            assert.lengthOf(spy.getCall(0).args, 0);
            spy.restore();
        });
        after(() => {
            Dispatcher.handleAction("CLEAR_ALL_DATA");
        });
    });
});
