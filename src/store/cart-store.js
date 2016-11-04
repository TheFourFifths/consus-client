import { Store } from 'consus-core/flux';
import StudentStore from './student-store';

let items = [];

class CartStore extends Store {
    getItems() {
        return items;
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
    items = [];
    store.emitChange();
});

store.registerHandler('CLEAR_ITEMS', () => {
    items = [];
    store.emitChange();
});

export default store;
