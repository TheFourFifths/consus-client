import { searchModel, deleteModel, getAllModels } from '../../lib/api-client';
import { Dispatcher } from 'consus-core/flux';

export default class ModelController {
    static getModel(address) {
        return searchModel(address).then( model => {
            Dispatcher.handleAction('MODEL_FOUND', model);
        }).catch( () => {
            Dispatcher.handleAction('NO_MODEL_FOUND');
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
