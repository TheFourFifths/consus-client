import { Store } from 'consus-core/flux';

let error = null;
let tag = null;

class ErrorStore extends Store{
    getError() {
        return error;
    }

    getTag() {
        return tag;
    }

    hasError() {
        return error !== null;
    }

    clearError(){
        error = null;
        tag = null;
    }
}

const store = new ErrorStore();

store.registerHandler('DEBUG', data => {
    error = data.error;
    tag = 'DEBUG';
    store.emitChange();
});
store.reigsterHandler('INFO', data => {
    error = data.error;
    tag = 'DEBUG';
    store.emitChange();
});
store.registerHandler('WARN', data => {
    error = data.error;
    tag = 'WARN';
    store.emitCahnge();
});
store.registerHandler('ERROR', data => {
    error = data.error;
    tag = 'ERROR';
    store.emitChange();
});

store.registerHandler('CLEAR_ERROR', data => {
    clearError();
});

export default store;
