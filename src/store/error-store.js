import { Store } from 'consus-core/flux';

let error = null;

class ErrorStore extends Store{
    getError() {
        return error;
    }

    clearError(){
        error = null;
    }
}

const store = new ErrorStore();

store.registerHandler('ERROR', data => {
    error = data.error;
    store.emitChange();
});

export default store;
