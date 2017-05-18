import { searchItem, searchModel, getAllItems, deleteItem, addFault, removeItemFault } from '../../lib/api-client';
import { Dispatcher } from 'consus-core/flux';
import { hashHistory } from 'react-router';

export default class ItemController {

    static addFault(faultObj){
        return addFault(faultObj.itemAddress, faultObj.fault).then( res => {
            Dispatcher.handleAction("ITEM_FOUND", res.item);
            return getAllItems();
        }).then( res => {
            Dispatcher.handleAction("ITEMS_RECEIVED", res);
        }).catch(e => {
            Dispatcher.handleAction("ERROR", {error: e});
        });
    }

    static removeItemFault(itemAddress){
        return removeItemFault(itemAddress).then( res => {
            Dispatcher.handleAction("ITEM_FOUND", res.item);
            return getAllItems();
        }).then( res => {
            Dispatcher.handleAction("ITEMS_RECEIVED", res);
        }).catch(e => {
            Dispatcher.handleAction("ERROR", {error: e});
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

    static goToModel(address) {
        return searchModel(address).then(model => {
            Dispatcher.handleAction("MODEL_FOUND", model);
            hashHistory.push('/model');
        }).catch(() => {
            Dispatcher.handleAction("NO_MODEL_FOUND");
        });
    }

}
