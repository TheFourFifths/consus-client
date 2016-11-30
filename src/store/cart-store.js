import { Store } from 'consus-core/flux';
import StudentStore from './student-store';
import { checkOutItems } from '../lib/api-client';

let items = [];

let timer = null;

function clearTimer() {
    clearTimeout(timer);
    timer = null;
}

class CartStore extends Store {
    getItems() {
        return items;
    }

    isOnTimeout(){
        return timer !== null;
    }
}

const store = new CartStore();

store.TIMEOUT_TIME = 60000;

store.registerHandler('STUDENT_FOUND', () => {
    if(store.isOnTimeout()){
        clearTimer();
    }
});

store.registerHandler('CHECKOUT_ITEM_FOUND', data => {
    if(store.isOnTimeout()){
        clearTimer();
    }
    let item = {
        address: data.address,
        status: data.status
    };
    items.push(item);
    timer = setTimeout(() => {
        checkOutItems(StudentStore.getStudent().id, items.map(item => item.address));
        timer = null;
    }, store.TIMEOUT_TIME);
    store.emitChange();
});

store.registerHandler('CHECKOUT_SUCCESS', () => {
    clearTimer();
    store.waitFor(StudentStore);
    items = [];
    store.emitChange();
});

store.registerHandler('CLEAR_ALL_DATA', () => {
    items = [];
    store.emitChange();
});

store.registerHandler('CLEAR_ITEMS', () => {
    items = [];
    store.emitChange();
});

export default store;
