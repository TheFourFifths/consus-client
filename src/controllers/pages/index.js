import { getAllModels, getAllItems } from '../../lib/api-client';
import { Dispatcher } from 'consus-core/flux';
import { hashHistory } from 'react-router';

export default class IndexController {
    static getItems() {
        getAllItems().then(items => {
            Dispatcher.handleAction('ITEMS_RECEIVED', items);
            hashHistory.push('/items');
        });
    }

    static getModels() {
        return getAllModels().then(models => {
            Dispatcher.handleAction("MODELS_RECEIVED", models);
            hashHistory.push('/models');
        });
    }
}
