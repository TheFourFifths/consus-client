import { createModel, getAllModels, updateModel } from '../../lib/api-client';
import { hashHistory } from 'react-router';
import { Dispatcher } from 'consus-core/flux';
import ModelPageController from '../pages/model';

export default class ModelFormController {

    static createModel(name, description, manufacturer, vendor, location, allowCheckout, price, count, b64Photo) {
        return createModel(name, description, manufacturer, vendor, location, allowCheckout, parseFloat(price), parseInt(count), b64Photo).then(model => {
            Dispatcher.handleAction("MODEL_CREATED", model);
            hashHistory.push('/models');
        }).catch(e => {
            Dispatcher.handleAction('ERROR', {
                error: e
            });
        });
    }

    static getModels(){
        return getAllModels().then( models => {
            Dispatcher.handleAction("MODELS_RECEIVED", models);
            hashHistory.push('/models');
        });
    }

    static updateModel(address, name, description, manufacturer, vendor, location, allowCheckout, price, count, changeStock, inStock, b64Photo) {
        return updateModel(address, name, description, manufacturer, vendor, location, allowCheckout, parseFloat(price), parseInt(count), changeStock, parseInt(inStock), b64Photo).then(model => {
            Dispatcher.handleAction('MODEL_UPDATED', model);
            ModelPageController.getModelAndItems(address);
        }).catch(e => {
            Dispatcher.handleAction('ERROR', {
                error: e
            });
        });
    }

}
