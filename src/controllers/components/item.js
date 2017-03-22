import { searchItem, getAllItems, deleteItem, addFault } from '../../lib/api-client';
import { Dispatcher } from 'consus-core/flux';

export default class ItemController {

    static addFault(faultObj){
        return addFault(faultObj.itemAddress, faultObj.fault).then( res => {
            Dispatcher.handleAction("ITEM_FOUND", res);
            return getAllItems();
        }).then( res => {
            Dispatcher.handleAction("ITEMS_RECEIVED", res);
        });
    }

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
        return searchItem(address).then(item => {
            Dispatcher.handleAction("ITEM_FOUND", item);
        }).catch(() => {
            Dispatcher.handleAction("NO_ITEM_FOUND");
        });
    }

}
