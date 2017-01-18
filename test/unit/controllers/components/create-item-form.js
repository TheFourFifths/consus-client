import { assert } from "chai";
import sinon from 'sinon';
import * as api from '../../../../.dist/lib/api-client';
import * as router from 'react-router';
import ItemFormController from '../../../../.dist/controllers/components/create-item-form'

describe('ItemFormController', () => {
    describe("createItem", () => {
        let createItem, hashHistorySpy;

        beforeEach(() => {
            createItem = sinon.stub(api, "createItem");
            //Have to set up hashHistory because it currently doesn't exist without the browser.
            router.hashHistory = {};
            hashHistorySpy = router.hashHistory.push = sinon.spy();
        });

        it('Should push "/items" to the hashHistory after item is created', () => {
            createItem.returns(
                new Promise(resolve => {
                    resolve();
                })
            );
            return ItemFormController.createItem('OIUIO').then(() => {
                assert.isTrue(hashHistorySpy.called);
                assert.strictEqual(hashHistorySpy.getCall(0).args.length, 1);
                assert.strictEqual(hashHistorySpy.getCall(0).args[0], "/items");
            });
        });

        afterEach(() => {
            createItem.restore();
        });
    });
});
