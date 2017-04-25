import { assert } from "chai";
import sinon from 'sinon';
import * as api from '../../../../.dist/lib/api-client';
import * as router from 'react-router';
import { Dispatcher } from 'consus-core/flux';
import OverdueItemReportPageController from '../../../../.dist/controllers/reports/overdue';

describe("OverdueItemReportPageController", () => {
    describe("getOverdueItems", () => {
        let dispatcherSpy, getOverdueItems, getAllModels;

        before(() => {
            dispatcherSpy = sinon.spy(Dispatcher, "handleAction");
            getOverdueItems = sinon.stub(api, "getOverdueItems");
            getAllModels = sinon.stub(api, "getAllModels");
        });


        it('Dispatches "OVERDUE_ITEMS_RECEIVED" when items are received', () => {
            getAllModels.returns(
                new Promise(resolve => {
                    resolve({
                        models:[]
                    })
                })
            );

            getOverdueItems.returns(
                new Promise(resolve => {
                    resolve({
                        items:[]
                    });
                })
            );

            return OverdueItemReportPageController.getOverdueItems().then(() => {
                assert.isTrue(dispatcherSpy.called);
                assert.lengthOf(dispatcherSpy.getCall(0).args, 2);
                assert.strictEqual(dispatcherSpy.getCall(0).args[0], "MODELS_RECEIVED");
                assert.lengthOf(dispatcherSpy.getCall(1).args, 2);
                assert.strictEqual(dispatcherSpy.getCall(1).args[0], "OVERDUE_ITEMS_RECEIVED");

            });
        });

        after(() => {
            dispatcherSpy.restore();
            getOverdueItems.restore();
            getAllModels.restore();
        });
    });

});
