import { Dispatcher } from 'consus-core/flux';
import CartStore from '../../../.dist/store/cart-store';
import { assert } from 'chai';

describe('CartStore', () => {

    beforeEach(() => {
        return Dispatcher.handleAction('CLEAR_ALL_DATA');
    });

    it('should instantiate without any items', () => {
        assert.strictEqual(CartStore.getItems().length, 0);
    });

    it('should add item to list', () => {
        Dispatcher.handleAction('CHECKOUT_ITEM_FOUND',{
            address: '123',
            status: 'AVAILABLE'
        });
        assert.strictEqual(CartStore.getItems()[0].address, '123');
        assert.strictEqual(CartStore.getItems()[0].status, 'AVAILABLE');
    });

    it('should clear items on checkout',() => {
        Dispatcher.handleAction('STUDENT_FOUND', {
            id: '123456',
            name: 'Pope Francis',
            items: []
        });
        Dispatcher.handleAction('CHECKOUT_ITEM_FOUND',{
            address: '123',
            status: 'AVAILABLE'
        });
        assert.strictEqual(CartStore.getItems()[0].address, '123');
        Dispatcher.handleAction('CHECKOUT_SUCCESS');
        assert.strictEqual(CartStore.getItems().length,0);
    });

    it('should clear items on cancel', () => {
      Dispatcher.handleAction('STUDENT_FOUND', {
          id: '123456',
          name: 'Pope Francis',
          items: []
      });
      Dispatcher.handleAction('CHECKOUT_ITEM_FOUND',{
          address: '123',
          status: 'AVAILABLE'
      });
      assert.strictEqual(CartStore.getItems()[0].address, '123');
      Dispatcher.handleAction('CLEAR_ITEMS');
      assert.strictEqual(CartStore.getItems().length,0);
    });

});
