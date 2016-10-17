import { Dispatcher } from 'consus-flux';
import CartStore from '../../../.dist/store/cart-store';
import { assert } from 'chai';

describe('CartStore', () => {

    it('should instantiate without any items', () => {
        assert.strictEqual(CartStore.getItems().length, 0);
    });

    it('should add item to list', () => {
        Dispatcher.handleAction('CHECKOUT_ITEM_FOUND',{
            id: '123',
            status: 'AVAILABLE'
        });
        assert.strictEqual(CartStore.getItems()[0].id, '123');
        assert.strictEqual(CartStore.getItems()[0].status, 'AVAILABLE');
    });

    it('should clear items on checkout',() => {
        Dispatcher.handleAction('CHECKOUT_ITEM_FOUND',{
            id: '123',
            status: 'AVAILABLE'
        });
        assert.strictEqual(CartStore.getItems()[0].id, '123');
        Dispatcher.handleAction('CHECKOUT_SUCCESS');

        assert.strictEqual(CartStore.getItems().length,0);
    });

});
