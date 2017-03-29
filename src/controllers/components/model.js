import { searchModel, deleteModel, getAllModels, createItem } from '../../lib/api-client';
import { Dispatcher } from 'consus-core/flux';

export default class ModelController {

    static getModel(address) {
        return searchModel(address).then( model => {
            Dispatcher.handleAction('MODEL_FOUND', model);
        }).catch( () => {
            Dispatcher.handleAction('NO_MODEL_FOUND');
        });
    }

    static addItemToModel(modelAddress){
        return createItem(modelAddress).then(item => {
            Dispatcher.handleAction('ITEM_CREATED', item);
            return getAllModels();
        }).then(models => {
            Dispatcher.handleAction("MODELS_RECEIVED", models);
        }).catch(e => {
            Dispatcher.handleAction('ERROR', { error: e.message });
        });
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
