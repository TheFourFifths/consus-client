import { Dispatcher } from 'consus-core/flux';
import ItemStore from '../../../.dist/store/item-store';
import { assert } from 'chai';

describe('ItemStore', () => {

    beforeEach(() => {
        return Dispatcher.handleAction('CLEAR_ALL_DATA');
    });

    it('should instantiate without an item', () => {
        assert.strictEqual(ItemStore.getItem(), null);
    });

    it('should get an item', () => {
        Dispatcher.handleAction('ITEM_FOUND',{
            id: '123',
            status: 'AVAILABLE'
        });
        assert.strictEqual(ItemStore.getItem().id, '123');
        assert.strictEqual(ItemStore.getItem().status, 'AVAILABLE');
    });

    it('should handle no-item', () => {
        Dispatcher.handleAction('NO_ITEM_FOUND');
        assert.isNull(ItemStore.getItem());
    });

    it('should get all items', () => {
        Dispatcher.handleAction('ITEMS_RECEIVED',{
            items:[{
                name: 'test1'
            },{
                name: 'test2'
            },{
                name: 'test3'
            }]
        });
        assert.strictEqual(ItemStore.getAllItems().length, 3);
    });


});
