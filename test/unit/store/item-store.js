import { Dispatcher } from 'consus-flux';
import ItemStore from '../../../.dist/store/item-store';
import { assert } from 'chai';

describe('ItemStore', () => {

    it('should instantiate without an item', () => {
        assert.strictEqual(ItemStore.getItem(), null);
    });

    it('should update an item', () => {
        Dispatcher.handleAction({
            type: 'ITEM_FOUND',
            data: {
                id: '123',
                status: 'AVAILABLE'
            }
        });
        assert.strictEqual(ItemStore.getItem().id, '123');
        assert.strictEqual(ItemStore.getItem().status, 'AVAILABLE');
    });

    it('should handle no-item', () => {
        Dispatcher.handleAction({
            type: 'NO_ITEM_FOUND'
        });
        assert.strictEqual(ItemStore.getItem(), null);
    });

});
