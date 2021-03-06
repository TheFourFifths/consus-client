import config from 'config';
import { Store } from 'consus-core/flux';

const DEFAULT_TIME_UNTIL_POP = config.get('toast.timeout') * 1000;  /* milliseconds */

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

store.registerHandler('MODEL_CHECKIN_SUCCESS', data => {
    addToast(`${data.quantity} ${data.modelName}(s) (${data.modelAddress}) checked in successfully.`);
    store.emitChange();
});

store.registerHandler('CHECKOUT_SUCCESS', () => {
    addToast('Checkout completed successfully.');
    store.emitChange();
});

store.registerHandler('MODEL_CREATED', data => {
    addToast(`Created a new ${data.name}.`);
    store.emitChange();
});

store.registerHandler('ITEM_CREATED', data => {
    addToast(`New item added: ${data.modelName} (${data.item.address})`);
    store.emitChange();
});

store.registerHandler('ITEM_DELETED', itemDeletedResponse => {
    addToast(`${itemDeletedResponse.modelName} ${itemDeletedResponse.itemAddress} was deleted.`);
    store.emitChange();
});

store.registerHandler('INVALID_CODE', () => {
    addToast('Invalid Admin Code.');
    store.emitChange();
});

store.registerHandler('STUDENTS_UPLOADED', () => {
    addToast('Students uploaded successfully.');
    store.emitChange();
});

store.registerHandler('FILE_UNSUPPORTED', () => {
    addToast('Unknown file extension. File must be in Excel format.');
    store.emitChange();
});
store.registerHandler('MODEL_UPDATED', model => {
    addToast(`${model.name} (${model.address}) was updated.`);
    store.emitChange();
});

store.registerHandler('MODEL_DELETED', model => {
    addToast(`${model.name} (${model.address}) was deleted.`);
    store.emitChange();
});

store.registerHandler('UNSERIALIZED_MODEL_ADDED', model => {
    addToast(`New ${model.name} (${model.address}) created.`);
    store.emitChange();
});

export default store;
