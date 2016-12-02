import { Store } from 'consus-core/flux';

let toasts = [];
let nextId = 0;

class ToastStore extends Store {

    getToasts() {
        return toasts;
    }

}

const store = new ToastStore();

function addToast(text) {
    toasts.push({
        id: nextId,
        text
    });
    nextId ++;
}

store.registerHandler('CLEAR_ALL_DATA', () => {
    toasts = [];
    nextId = 0;
});

store.registerHandler('CREATE_TOAST', data => {
    addToast(data.text);
    store.emitChange();
});

store.registerHandler('POP_TOAST', data => {
    let index = toasts.findIndex(toast => toast.id === data.id);
    if (index > -1) {
        toasts.splice(index, 1);
        store.emitChange();
    }
});

export default store;
