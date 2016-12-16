import { assert } from "chai";
import sinon from 'sinon';
import * as api from '../../../../.dist/lib/api-client';
import { Dispatcher } from 'consus-core/flux';
import ItemController from '../../../../.dist/controllers/components/item';

describe("ItemController", () => {
    describe("deleteItem",() => {
        let dispatcherSpy, deleteItem;
        beforeEach(() => {
            dispatcherSpy = sinon.spy(Dispatcher, "handleAction");
            deleteItem = sinon.stub(api, "deleteItem");
        });

        it('Dispatches "ITEMS_RECEIVED" after Item is deleted',()=>{
            deleteItem.returns(
                new Promise(resolve => {
                    resolve({items:[]});
                })
            );

            return ItemController.deleteItem("12kl3").then(() => {
                assert.isTrue(dispatcherSpy.called);
                assert.strictEqual(dispatcherSpy.getCall(0).args.length, 2);
                assert.strictEqual(dispatcherSpy.getCall(0).args[0], "ITEMS_RECEIVED");
            });
        });

        it('Dispatches an "ERROR" if deleteItem fails', () => {
            deleteItem.returns(
                new Promise((resolve, reject) => {
                    reject("NO");
                })
            );

            return ItemController.deleteItem("12kl3").then(() => {
                assert.isTrue(dispatcherSpy.called);
                assert.strictEqual(dispatcherSpy.getCall(0).args.length, 2);
                assert.strictEqual(dispatcherSpy.getCall(0).args[0], "ERROR");
                assert.strictEqual(dispatcherSpy.getCall(0).args[1].error, "NO");
            });
        });
        
        afterEach(() => {
            dispatcherSpy.restore();
            deleteItem.restore();
        });
    });
    
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
