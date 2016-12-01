import { Store } from 'consus-core/flux';
import { searchModel } from '../lib/api-client';
let model = null;
let models = [];

class ModelStore extends Store {

    getModel() {
        return model;
    }

    getAllModels(){
        return models;
    }
    searchModelByAddress(address){
        return searchModel(address);
    }
}

const store = new ModelStore();

store.registerHandler('MODEL_FOUND', data => {
    model = data;
    store.emitChange();
});

store.registerHandler('NO_MODEL_FOUND', () => {
    model = null;
    store.emitChange();
});

store.registerHandler('CLEAR_ALL_DATA', () => {
    model = null;
    models = [];
});

store.registerHandler('MODELS_RECEIVED', data => {
    models = data.models;
    store.emitChange();
});

store.registerHandler('MODEL_CREATED', data => {
    models.push(data);
    store.emitChange();
});

export default store;
