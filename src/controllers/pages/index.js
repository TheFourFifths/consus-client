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
        return Promise.all([getOverdueItems(), getAllModels()]).then(results => {
            Dispatcher.handleAction("MODELS_RECEIVED", results[1]);
            Dispatcher.handleAction("OVERDUE_ITEMS_RECEIVED", results[0]);
            hashHistory.push('/overdue');
        });
    }

    static getStudents() {
        return getAllModels().then(models => {
            Dispatcher.handleAction("MODELS_RECEIVED", models);
            hashHistory.push('/students');
        });
    }

    static gotoLostEquipment() {
        return getAllModels().then(models => {
            Dispatcher.handleAction('MODLES_RECEIVED', models);
            return getAllItems();
        }).then(items => {
            Dispatcher.handleAction('ITEMS_RECEIVED', items);
            hashHistory.push(`/lost_equipment`);
        });
    }

    static gotoNewItemPage() {
        return getAllModels().then(models => {
            Dispatcher.handleAction('MODELS_RECEIVED', models);
            hashHistory.push('/items/new');
        });
    }

    static goToInventoryPage(){
        return Promise.all([getAllItems(), getAllModels()]).then(results => {
            Dispatcher.handleAction("MODELS_RECEIVED", results[1]);
            Dispatcher.handleAction("ITEMS_RECEIVED", results[0]);
            hashHistory.push('/inventory');
        });
    }

    static navigateTo(url) {
        hashHistory.push(url);
    }

}
