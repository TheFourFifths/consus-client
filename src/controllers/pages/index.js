import { getAllModels, getAllItems, getOverdueItems } from '../../lib/api-client';
import { Dispatcher } from 'consus-core/flux';
import { hashHistory } from 'react-router';

export default class IndexController {
    static getItems() {
        return getAllItems().then(items => {
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

    static getOverdueItems() {
        return getOverdueItems().then(items => {
            Dispatcher.handleAction("OVERDUE_ITEMS_RECEIVED", items);
            hashHistory.push('/overdue');
        });
    }
}
