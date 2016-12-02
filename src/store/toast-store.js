import { Store } from 'consus-core/flux';

let messages = [];
let nextId = 0;

class Toast extends Store {

    getToasts() {
        return messages;
    }

}

const store = new ToastStore();

function addMessage(text) {
    messages.push({
        id: nextId,
        text: data.text
    });
    nextId ++;
}

store.registerHandler('CREATE_TOAST', data => {
    addMessage(data.text);
    store.emitChange();
});

store.registerHandler('POP_TOAST', data => {
    let index = messages.findIndex(message => message.id === data.id);
    if (index > -1) {
        messages.splice(index, 1);
        store.emitChange();
    }
});

export default store;
