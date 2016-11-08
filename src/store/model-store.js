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
    getAllModels(){
        return model;
    }

}

const store = new ModelStore();

store.registerHandler('MODEL_FOUND', data => {
    model = data;
    store.emitChange();
    hashHistory("/model/")
});

store.registerHandler('NO_MODEL_FOUND', () => {
    model = null;
    store.emitChange();
});

store.registerHandler('MODELS_RECEIVED', data => {
    model = data.models;
    store.emitChange();
});

store.registerHandler('MODEL_CREATED', data => {
    model.push(data);
    store.emitChange();
});

export default store;
