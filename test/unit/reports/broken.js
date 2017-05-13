import { assert } from "chai";
import sinon from 'sinon';
import * as api from '../../../.dist/lib/api-client';
import { Dispatcher } from 'consus-core/flux';
import BrokenItemsReportController from '../../../.dist/controllers/reports/broken';

describe('BrokenItemsReportController', () => {
    describe("getFaultyItems", () => {
        let getAllFaultyItems, dispatcherSpy;

        beforeEach(() => {
            getAllFaultyItems = sinon.stub(api, "getAllFaultyItems");
            dispatcherSpy = sinon.spy(Dispatcher, "handleAction");
        });

        it('Should Dispatch FAULTY_ITEMS_RECEIVED after getting items', () => {
            getAllFaultyItems.returns(
                new Promise(resolve => {
                    resolve([]);
                })
            );
            return BrokenItemsReportController.getFaultyItems().then(() => {
                assert.isTrue(dispatcherSpy.called);
                assert.strictEqual(dispatcherSpy.getCall(0).args.length, 2);
                assert.strictEqual(dispatcherSpy.getCall(0).args[0], "FAULTY_ITEMS_RECEIVED");
            });
        });

        afterEach(() => {
            getAllFaultyItems.restore();
        });
    });
});
