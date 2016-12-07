import { Store } from 'consus-core/flux';

const DEFAULT_TIME_UNTIL_POP = 5000; // 5 seconds

let toasts = [];
let nextId = 0;

class ToastStore extends Store {

    getToasts() {
        return toasts;
    }

}

const store = new ToastStore();

function addToast(text, timeout = DEFAULT_TIME_UNTIL_POP) {
    toasts.push({
        id: nextId,
        text,
        timeout
    });
    nextId ++;
}

store.registerHandler('CLEAR_ALL_DATA', () => {
    toasts = [];
    nextId = 0;
});

store.registerHandler('CREATE_TOAST', data => {
    addToast(data.text, data.timeout);
    store.emitChange();
});

store.registerHandler('POP_TOAST', data => {
    let index = toasts.findIndex(toast => toast.id === data.id);
    if (index > -1) {
        toasts.splice(index, 1);
        store.emitChange();
    }
});

store.registerHandler('CHECKIN_SUCCESS', data => {
    addToast(`Item checked in successfully: ${data.modelName} (${data.itemAddress})`);
    store.emitChange();
});

store.registerHandler('CHECKOUT_SUCCESS', () => {
    addToast('Checkout completed successfully!');
    store.emitChange();
});

store.registerHandler('MODEL_CREATED', data => {
    addToast(`Created a new ${data.name}`);
    store.emitChange();
});

store.registerHandler('ITEM_CREATED', data => {
    addToast(`Created a new ${data.modelName} item!`);
    store.emitChange();
});

export default store;
