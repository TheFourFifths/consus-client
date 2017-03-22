import config from 'config';
import { Store } from 'consus-core/flux';
import StudentStore from './student-store';
import { checkOutContents } from '../lib/api-client';

let contents = [];

let timer = null;

function startTimer(period) {
    timer = setTimeout(() => {
        checkOutContents(StudentStore.getStudent().id, contents.map(content => content.address));
        clearTimer();
    }, period);
}

function clearTimer() {
    clearTimeout(timer);
    timer = null;
}

class CartStore extends Store {
    getContents() {
        return contents;
    }

    isOnTimeout(){
        return timer !== null;
    }
}

const store = new CartStore();

store.TIMEOUT_TIME = config.get('cart.timeout') * 1000;  /* milliseconds */

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
    contents.push(item);
    startTimer(store.TIMEOUT_TIME);
    store.emitChange();
});

store.registerHandler('CHECKOUT_MODEL_FOUND', data => {
    if(store.isOnTimeout()){
        clearTimer();
    }
    if(data.inStock > 0){
        let model = {
            address: data.address,
            quantity: 1
        };
        contents.push(model);
    }
    startTimer(store.TIMEOUT_TIME);
    store.emitChange();
});

store.registerHandler('CHECKOUT_DUPLICATE_MODEL', data => {
    if(store.isOnTimeout()){
        clearTimer();
    }

    let model = contents.find(content => {
        return content.address === data.address;
    });

    model.quantity++;

    startTimer(store.TIMEOUT_TIME);
    store.emitChange();
});

store.registerHandler('CHECKOUT_SUCCESS', () => {
    clearTimer();
    store.waitFor(StudentStore);
    contents = [];
    store.emitChange();
});

store.registerHandler('CLEAR_ALL_DATA', () => {
    contents = [];
    store.emitChange();
});

store.registerHandler('CLEAR_CART_CONTENTS', () => {
    contents = [];
    store.emitChange();
});

export default store;
