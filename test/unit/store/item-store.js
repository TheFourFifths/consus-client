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

    it('should find overdue items', () => {
        Dispatcher.handleAction('STUDENT_FOUND',{
            id: '432345',
            name: 'Thor',
            items: [{address:1, timestamp:0},{address:2},{address:3, timestamp:0},{address:4}]
        });
        let items = ItemStore.getAllItems();
        for(let item of items){
            if(item.address%2 == 1) {
                assert(item.isOverdue); // Odd items are arbitrarily overdue
            }
            else {
                assert.isFalse(item.isOverdue); // Even items are not overdue
            }
        }
    });

    it('should receive overdue items', () => {
        Dispatcher.handleAction('OVERDUE_ITEMS_RECEIVED',{
            items:[{
                name: 'test1'
            },{
                name: 'test2'
            },{
                name: 'test3'
            }]
        });
        assert.lengthOf(ItemStore.getOverdueItems(), 3);
    });

});
