import { searchItem, deleteItem } from '../../lib/api-client';
import { Dispatcher } from 'consus-core/flux';

export default class ItemController {

    static deleteItem(item){
        return deleteItem(item).then(data => {
            Dispatcher.handleAction('ITEMS_RECEIVED', data);
            Dispatcher.handleAction('CREATE_TOAST', {
                text: `An item was deleted: ${data.modelName} (${item.address})`
            });
        }).catch(error => {
            Dispatcher.handleAction('ERROR', { error: error.message });
        });
    }

    static getItem(address) {
        return searchItem(address).then( item => {
            Dispatcher.handleAction("ITEM_FOUND", item);
        }).catch( () => {
            Dispatcher.handleAction("NO_ITEM_FOUND");
        });
    }
}
