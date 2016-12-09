import { assert } from "chai";
import sinon from 'sinon';
import * as api from '../../../../.dist/lib/api-client';
import { Dispatcher } from 'consus-core/flux';
import ItemController from '../../../../.dist/controllers/components/item';


describe("ItemController", () => {
    describe("getItem",() => {
        let dispatcherSpy, searchItem;
        beforeEach(() => {
            dispatcherSpy = sinon.spy(Dispatcher, "handleAction");
            searchItem = sinon.stub(api, "searchItem");
        });

        it('Dispatches "ITEM_FOUND" when Item is found',()=>{

            searchItem.returns(
                new Promise(resolve => {
                    resolve({status:"AVAILABLE"});
                })
            );

            return ItemController.getItem("12kl3").then(() => {
                assert.isTrue(dispatcherSpy.called);
                assert.strictEqual(dispatcherSpy.getCall(0).args.length, 2);
                assert.strictEqual(dispatcherSpy.getCall(0).args[0], "ITEM_FOUND");
            });

        });

        it('Dispatches "NO_ITEM_FOUND" when item is not found', () => {
            searchItem.returns(
                new Promise((resolve, reject) => {
                    reject('nope');
                })
            );

            return ItemController.getItem("12kl3").then(() => {
                assert.isTrue(dispatcherSpy.called);
                assert.strictEqual(dispatcherSpy.getCall(0).args.length, 1);
                assert.strictEqual(dispatcherSpy.getCall(0).args[0], "NO_ITEM_FOUND");
            });
        });

        afterEach(() => {
            dispatcherSpy.restore();
            searchItem.restore();
        });
    });
});
