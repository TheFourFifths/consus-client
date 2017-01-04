import { assert } from "chai";
import sinon from 'sinon';
import * as api from '../../../../.dist/lib/api-client';
import { Dispatcher } from 'consus-core/flux';
import OverdueItemsController from '../../../../.dist/controllers/pages/overdue';

describe("OverdueItemsController", () => {
    let dispatcherSpy;

    beforeEach(() => {
        dispatcherSpy = sinon.spy(Dispatcher, "handleAction");
    });

    describe("getOverdueItems", () => {
        let overdueStub;
        beforeEach(() => {
            overdueStub = sinon.stub(api, "getOverdueItems");
        });

        it('Dispatches "OVERDUE_ITEMS_RECEIVED" upon receiving items', () => {
            overdueStub.returns(
                new Promise( resolve => {
                    resolve();
                })
            );

            return OverdueItemsController.getOverdueItems().then(() => {
                assert.isTrue(dispatcherSpy.called);
                assert.strictEqual(dispatcherSpy.getCall(0).args[0], "OVERDUE_ITEMS_RECEIVED");
            });
        });

        afterEach(() => {
            overdueStub.restore();
        });
    });

    afterEach(() => {
        dispatcherSpy.restore();
    });
});
