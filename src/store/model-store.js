import { Store } from 'consus-core/flux';
import { searchModel } from '../lib/api-client';
let model = null;

class ModelStore extends Store {

    getModel() {
        return model;
    }
    getAllModels(){
        return model;
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

store.registerHandler('MODELS_RECEIVED', data => {
    model = data.models;
    store.emitChange();
});

store.registerHandler('MODEL_CREATED', data => {
    model.push(data);
    store.emitChange();
});

export default store;
