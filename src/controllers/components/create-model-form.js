import { createModel, getAllModels } from '../../lib/api-client';
import { hashHistory } from 'react-router';
import { Dispatcher } from 'consus-core/flux';

export default class ModelFormController {
    static createModel(name, description, manufacturer, vendor, location, isFaulty, faultDescription, price, count) {
        return createModel(name, description, manufacturer, vendor, location, isFaulty, faultDescription, price, count).then(model=> {
            Dispatcher.handleAction("MODEL_CREATED", model);
            hashHistory.push('/models');
        }).catch(() => {
            Dispatcher.handleAction('ERROR', {
                error: 'The server was not able to create the model. Is the server down?'
            });
        });
    }

    static getModels(){
        return getAllModels().then( models => {
            Dispatcher.handleAction("MODELS_RECEIVED", models);
            hashHistory.push('/models');
        });
    }
}
