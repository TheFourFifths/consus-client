import { Store } from 'consus-core/flux';

let message = null;
let tag = null;

class ErrorStore extends Store{
    getError() {
        return message;
    }

    getTag() {
        return tag;
    }

    hasError() {
        return message !== null;
    }
}

const store = new ErrorStore();

store.registerHandler('DEBUG', data => {
    message = data.debug;
    tag = 'DEBUG';
    store.emitChange();
});
store.registerHandler('INFO', data => {
    message = data.info;
    tag = 'INFO';
    store.emitChange();
});
store.registerHandler('WARN', data => {
    message = data.warn;
    tag = 'WARNING';
    store.emitChange();
});
store.registerHandler('ERROR', data => {
    message = data.error;
    tag = 'ERROR';
    store.emitChange();
});

store.registerHandler('CLEAR_ERROR', () => {
    message = null;
    tag = null;
    store.emitChange();
});

export default store;
