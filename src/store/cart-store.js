import { Store } from 'consus-core/flux';
import StudentStore from './student-store';
import { checkOutContents } from '../lib/api-client';

let contents = [];

let timer = null;

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
    contents.push(item);
    timer = setTimeout(() => {
        checkOutContents(StudentStore.getStudent().id, contents.map(content => content.address));
        timer = null;
    }, store.TIMEOUT_TIME);
    store.emitChange();
});

store.registerHandler('CHECKOUT_MODEL_FOUND', data => {
    if(store.isOnTimeout()){
        clearTimer();
    }
    let model = {
        address: data.address,
        quantity: 1
    };
    contents.push(model);
    timer = setTimeout(() => {
        checkOutContents(StudentStore.getStudent().id, contents.map(content => content.address));
        timer = null;
    }, store.TIMEOUT_TIME);
    store.emitChange();
});

store.registerHandler('CHECKOUT_DUPLICATE_MODEL', data => {
    if(store.isOnTimeout()){
        clearTimer();
    }

    contents.find(content => {
        return content.address === data.address;
    }).quantity++;

    timer = setTimeout(() => {
        checkOutContents(StudentStore.getStudent().id, contents.map(content => content.address));
        timer = null;
    }, store.TIMEOUT_TIME);
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

store.registerHandler('CLEAR_CONTENTS', () => {
    contents = [];
    store.emitChange();
});

export default store;
