import { Store } from 'consus-core/flux';

let model = null;

class ModelStore extends Store {

    getModel() {
        if (model === null) {
            return model;
        }
        return {
            id: model.id,
            name: model.name
        };
    }

}

const store = new ModelStore();

store.registerHandler('MODEL_FOUND', data => {
    model = {
        id: data.id,
        name: data.name
    };
    store.emitChange();
});

store.registerHandler('NO_MODEL_FOUND', () => {
    model = null;
    store.emitChange();
});

store.registerHandler('CLEAR_ALL_DATA', () => {
    model = null;
    store.emitChange();
});

export default store;
