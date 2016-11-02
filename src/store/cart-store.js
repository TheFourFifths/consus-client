import { Store } from 'consus-core/flux';
import StudentStore from './student-store';

let items = [];

class CartStore extends Store {
    getItems() {
        return items;
    }

    clearItems() {
        items = [];
        this.emitChange();
    }
}

const store = new CartStore();

store.registerHandler('CHECKOUT_ITEM_FOUND', data => {
    let item = {
        address: data.address,
        status: data.status
    };
    items.push(item);
    store.emitChange();
});

store.registerHandler('CHECKOUT_SUCCESS', () => {
    store.waitFor(StudentStore);
    store.clearItems();
    store.emitChange();
});

export default store;
