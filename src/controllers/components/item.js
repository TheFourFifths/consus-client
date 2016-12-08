import { searchItem } from '../../lib/api-client';
import { Dispatcher } from 'consus-core/flux';

export default class ItemController {
    static getItem(address) {
        searchItem(address).then( item => {
            Dispatcher.handleAction("ITEM_FOUND", item);
        }).catch( () => {
            Dispatcher.handleAction("NO_ITEM_FOUND");
        })
    }
}
