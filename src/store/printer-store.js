import { Store } from 'consus-core/flux';

let text;

class PrinterStore extends Store{

    getText() {
        return text;
    }

}

const store = new PrinterStore();

store.registerHandler('CLEAR_ALL_DATA', () => {
    text = undefined;
    store.emitChange();
});

store.registerHandler('PROMPT_TO_PRINT', data => {
    text = data.text;
    store.emitChange();
});

store.registerHandler('CLOSE_PRINTER', () => {
    text = undefined;
    store.emitChange();
});

export default store;
