import { assert } from "chai";
import sinon from 'sinon';
import * as api from '../../../../.dist/lib/api-client';
import * as router from 'react-router';
import { Dispatcher } from 'consus-core/flux';
import CheckoutFrequencyReportPageController from '../../../../.dist/controllers/reports/checkout-frequency';

describe("CheckoutFrequencyReportPageController", () => {
    describe("getAllItems", () => {
        let dispatcherSpy, getAllItems, getAllModels;

        before(() => {
            dispatcherSpy = sinon.spy(Dispatcher, "handleAction");
            getAllItems = sinon.stub(api, "getAllItems");
            getAllModels = sinon.stub(api, "getAllModels");
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

            return CheckoutFrequencyReportPageController.getAllItems().then(() => {
                assert.isTrue(dispatcherSpy.called);
                assert.lengthOf(dispatcherSpy.getCall(0).args, 2);
                assert.strictEqual(dispatcherSpy.getCall(0).args[0], "MODELS_RECEIVED");
                assert.lengthOf(dispatcherSpy.getCall(1).args, 2);
                assert.strictEqual(dispatcherSpy.getCall(1).args[0], "ITEMS_RECEIVED");

            });
        });

        after(() => {
            dispatcherSpy.restore();
            getAllItems.restore();
            getAllModels.restore();
        });
    });

});
