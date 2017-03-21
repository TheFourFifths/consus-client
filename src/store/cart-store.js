import { Store } from 'consus-core/flux';
import StudentStore from './student-store';
import { checkOutContents } from '../lib/api-client';

let contents = [];
let isLongterm = false;
let professor = null;
let dueDate = null;
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
    getIsLongterm(){
        return isLongterm;
    }
    getProfessor(){
        return professor;
    }
    getDueDate(){
        return dueDate;
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
    dueDate = null;
    professor = null;
    isLongterm = false;
    store.emitChange();
});
store.registerHandler('EDIT_IS_LONGTERM', data => {
    isLongterm = data.isLongterm;
    store.emitChange();
});
store.registerHandler('EDIT_LONGTERM_DUEDATE', data => {
    dueDate = data.dueDate;
    store.emitChange();
});
store.registerHandler('EDIT_LONGTERM_PROFESSOR', data => {
    professor = data.professor;
    store.emitChange();
});
store.registerHandler('CLEAR_ALL_DATA', () => {
    contents = [];
    dueDate = null;
    professor = null;
    isLongterm = false;
    store.emitChange();
});

store.registerHandler('CLEAR_CART_CONTENTS', () => {
    contents = [];
    dueDate = null;
    professor = null;
    isLongterm = false;
    store.emitChange();
});

export default store;
