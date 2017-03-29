import { Dispatcher } from 'consus-core/flux';
import CartStore from '../../../.dist/store/cart-store';
import StudentStore from '../../../.dist/store/student-store';
import ModelStore from '../../../.dist/store/model-store';
import { assert } from 'chai';

describe('CartStore', () => {

    beforeEach(() => {
        return Dispatcher.handleAction('CLEAR_ALL_DATA');
    });

    it('should instantiate without any items', () => {
        assert.strictEqual(CartStore.getContents().length, 0);
    });

    it('should add item to list', () => {
        Dispatcher.handleAction('CHECKOUT_ITEM_FOUND',{
            address: '123',
            status: 'AVAILABLE'
        });
        assert.strictEqual(CartStore.getContents()[0].address, '123');
    });

    it('should clear items on checkout',() => {
        Dispatcher.handleAction('STUDENT_FOUND', {
            id: 123456,
            name: 'Pope Francis',
            items: []
        });
        Dispatcher.handleAction('CHECKOUT_ITEM_FOUND',{
            address: '123',
            status: 'AVAILABLE'
        });
        assert.strictEqual(CartStore.getContents()[0].address, '123');
        Dispatcher.handleAction('CHECKOUT_SUCCESS');
        assert.strictEqual(CartStore.getContents().length,0);
    });

    it('should clear items on cancel', () => {
      Dispatcher.handleAction('STUDENT_FOUND', {
          id: 123456,
          name: 'Pope Francis',
          items: []
      });
      Dispatcher.handleAction('CHECKOUT_ITEM_FOUND',{
          address: '123',
          status: 'AVAILABLE'
      });
      assert.strictEqual(CartStore.getContents()[0].address, '123');
      Dispatcher.handleAction('CLEAR_CART_CONTENTS');
      assert.strictEqual(CartStore.getContents().length,0);
    });

    it('times out', function(done) {
        Dispatcher.handleAction("STUDENT_FOUND", {
            id: 111111,
            name: 'Poe',
            items: []
        });
        assert.isFalse(CartStore.isOnTimeout());
        //shorten timeout time so tests don't just take a minute longer
        CartStore.TIMEOUT_TIME = 10;
        Dispatcher.handleAction('CHECKOUT_ITEM_FOUND',{
            address: '123',
            status: 'AVAILABLE'
        });
        assert.isTrue(CartStore.isOnTimeout());
        setTimeout(() => {
            assert.isFalse(CartStore.isOnTimeout());
            done();
        }, CartStore.TIMEOUT_TIME);
    });

    it('times out for models', function(done){
        Dispatcher.handleAction("STUDENT_FOUND", {
            id: '111111',
            name: 'Poe',
            items: []
        });
        assert.isFalse(CartStore.isOnTimeout());
        CartStore.TIMEOUT_TIME = 10;
        Dispatcher.handleAction('CHECKOUT_MODEL_FOUND',{
            address: '1234',
            allowCheckout: true,
            inStock: 5
        });
        assert.isTrue(CartStore.isOnTimeout());
        setTimeout(() => {
            assert.isFalse(CartStore.isOnTimeout());
            done();
        }, CartStore.TIMEOUT_TIME);
    });

    it('cancels timeout when new student is scanned', () => {
        Dispatcher.handleAction("STUDENT_FOUND", {
            id: 111111,
            name: 'Poe',
            items: []
        });
        assert.isFalse(CartStore.isOnTimeout());
        CartStore.TIMEOUT_TIME = 60000;
        Dispatcher.handleAction('CHECKOUT_ITEM_FOUND',{
            address: '123',
            status: 'AVAILABLE'
        });
        assert.isTrue(CartStore.isOnTimeout());
        Dispatcher.handleAction("STUDENT_FOUND", {
            id: 123432,
            name: 'Testy McTestface',
            items: []
        });
        assert.isFalse(CartStore.isOnTimeout());
    });

    it('cancels timeout when new model is scanned', () => {
        Dispatcher.handleAction("STUDENT_FOUND", {
            id: '111111',
            name: 'Poe',
            items: []
        });
        assert.isFalse(CartStore.isOnTimeout(), 'first check');
        CartStore.TIMEOUT_TIME = 60000;
        Dispatcher.handleAction('CHECKOUT_MODEL_FOUND',{
            address: '1234',
            allowCheckout: true,
            inStock: 5
        });
        assert.isTrue(CartStore.isOnTimeout(), 'second check');
        Dispatcher.handleAction('CHECKOUT_MODEL_FOUND',{
            address: '1234',
            allowCheckout: true,
            inStock: 5
        });
        Dispatcher.handleAction('CHECKOUT_SUCCESS',{
            address: '1234',
            allowCheckout: true,
            inStock: 5
        });
        assert.isFalse(CartStore.isOnTimeout(), 'third check');
    });

    it('should add models to contents', () => {
        let model = { address: '123', allowCheckout: true, inStock: 12 };
        Dispatcher.handleAction('MOEDL_CREATED', model);
        Dispatcher.handleAction('STUDENT_FOUND', {
            id: '123456',
            name: 'Pope Francis',
            items: []
        });
        Dispatcher.handleAction('CHECKOUT_MODEL_FOUND', model);
        assert.strictEqual(CartStore.getContents()[0].address, '123');
    });

    it('should not add out-of-stock models to contents', () => {
        let model = { address: '123', allowCheckout: true, inStock: 0 };
        Dispatcher.handleAction('MOEDL_CREATED', model);
        Dispatcher.handleAction('STUDENT_FOUND', {
            id: '123456',
            name: 'Pope Francis',
            items: []
        });
        Dispatcher.handleAction('CHECKOUT_MODEL_FOUND', model);
        assert.lengthOf(CartStore.getContents(), 0, 'No model should be in the cart');
    });

});
