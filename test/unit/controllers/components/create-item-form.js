import { assert } from "chai";
import sinon from 'sinon';
import * as api from '../../../../.dist/lib/api-client';
import { hashHistory } from 'react-router';
import ItemFormController from '../../../../.dist/controllers/components/create-item-form'

describe('ItemFormController', () => {
    describe("createItem", () => {
        let spy, createItem;

        before(() => {
            createItem = sinon.stub(api, "createItem");
            spy = sinon.spy(hashHistory, 'push');
        });

        it('Should push "/" to the hashHistory after item is created',() => {
            ItemFormController.createItem('OIUIO').then(() => {
                assert.isTrue(spy.called);
                assert.strictEqual(spy.getCall(0).args.length, 1);
                assert.strictEqual(spy.getCall(0).args[0], "/");
            });
        });

        after(() => {
            createItem.restore();
            spy.restore();
        });
    });
});
