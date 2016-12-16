import { searchItem, deleteItem } from '../../lib/api-client';
import { Dispatcher } from 'consus-core/flux';

export default class ItemController {

    static deleteItem(address){
        return deleteItem(address).then(items => {
            Dispatcher.handleAction('ITEMS_RECEIVED', items);
        }).catch(error => {
            Dispatcher.handleAction('ERROR', { error });
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
