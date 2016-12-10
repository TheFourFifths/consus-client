import { searchItem, deleteItem } from '../../lib/api-client';
import { Dispatcher } from 'consus-core/flux';

export default class ItemController {

    static deleteItem(address){
        return deleteItem(address).then(data => {
            Dispatcher.handleAction('ITEMS_RECEIVED', data);
        }).catch(data => {
            Dispatcher.handleAction('ERROR', {
                error: data
            });
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
