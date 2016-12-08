import { searchModel } from '../../lib/api-client';
import { Dispatcher } from 'consus-core/flux';

export default class ModelController {
    static getModel(address) {
        searchModel(address).then( model => {
            Dispatcher.handleAction("MODEL_FOUND", model);
        }).catch( () => {
            Dispatcher.handleAction("NO_MODEL_FOUND");
        });
    }
}
