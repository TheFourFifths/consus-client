import { Store } from 'consus-core/flux';
import StudentStore from './student-store';
import { checkOutItems } from '../lib/api-client';

let items = [];

let timer = null;
let isOnTimer = false;
let TIMEOUT_TIME = 60000;

class CartStore extends Store {
    getItems() {
        return items;
    }

    isOnTimeout(){
        return isOnTimer;
    }
}

const store = new CartStore();

store.registerHandler('STUDENT_FOUND', () => {
    if(isOnTimer){
        clearTimeout(timer);
        isOnTimer = false;
    }
});

store.registerHandler('CHECKOUT_ITEM_FOUND', data => {
    if(timer !== null) {
        clearTimeout(timer);
    }
    let item = {
        address: data.address,
        status: data.status
    };
    items.push(item);
    timer = setTimeout(() => {
        checkOutItems(StudentStore.getStudent().id, items.map(item =>{return item.address;}));
        isOnTimer = false;
    }, TIMEOUT_TIME);
    isOnTimer = true;
    store.emitChange();
});

store.registerHandler('CHECKOUT_SUCCESS', () => {
    clearTimeout(timer);
    isOnTimer = false;
    timer = null;
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
