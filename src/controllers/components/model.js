import { searchModel, deleteModel, getAllModels, createItem, addUnserializedModel } from '../../lib/api-client';
import { Dispatcher } from 'consus-core/flux';
import ModelStore from '../../store/model-store';

export default class ModelController {
    static getModel(address) {
        return searchModel(address).then( model => {
            Dispatcher.handleAction('MODEL_FOUND', model);
        }).catch( () => {
            Dispatcher.handleAction('NO_MODEL_FOUND');
        });
    }

    static newModelInstance(modelAddress){
        if(ModelStore.getModelByAddress(modelAddress).allowCheckout) {
            return addUnserializedModel(modelAddress).then(model => {
                Dispatcher.handleAction('UNSERIALIZED_MODEL_ADDED', model);
                return getAllModels();
            }).then(models => {
                Dispatcher.handleAction("MODELS_RECEIVED", models);
            }).catch(e => {
                Dispatcher.handleAction('ERROR', { error: e.message });
            });
        } else {
            return createItem(modelAddress).then(item => {
                Dispatcher.handleAction('ITEM_CREATED', item);
                return getAllModels();
            }).then(models => {
                Dispatcher.handleAction("MODELS_RECEIVED", models);
            }).catch(e => {
                Dispatcher.handleAction('ERROR', { error: e.message });
            });
        }
    }

    static deleteModel(address){
        return deleteModel(address).then(data => {
            Dispatcher.handleAction('MODEL_DELETED', data.deletedModel);
        }).catch(error => {
            Dispatcher.handleAction('ERROR', {
                error: error.message
            });
        }).then(() => {
            return getAllModels();
        }).then(models => {
            Dispatcher.handleAction("MODELS_RECEIVED", models);
        }).catch(error => {
            Dispatcher.handleAction('ERROR', {
                error: error.message
            });
        });
    }
}
