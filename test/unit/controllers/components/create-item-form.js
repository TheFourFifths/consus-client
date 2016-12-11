import { assert } from "chai";
import sinon from 'sinon';
import * as api from '../../../../.dist/lib/api-client';
import * as router from 'react-router';
import ItemFormController from '../../../../.dist/controllers/components/create-item-form'

describe('ItemFormController', () => {
    describe("createItem", () => {
        let createItem;

        before(() => {
            createItem = sinon.stub(api, "createItem");
            createItem.returns(
                new Promise(resolve => {
                    resolve();
                })
            );
        });

        it('Should push "/" to the hashHistory after item is created',() => {
            //Have to set up hashHistory because it currently doesn't exist without the browser.
            router.hashHistory = {};
            let spy = router.hashHistory.push = sinon.spy();
            return ItemFormController.createItem('OIUIO').then(() => {
                assert.isTrue(spy.called);
                assert.strictEqual(spy.getCall(0).args.length, 1);
                assert.strictEqual(spy.getCall(0).args[0], "/");
            });
        });

        after(() => {
            createItem.restore();
        });
    });
});
