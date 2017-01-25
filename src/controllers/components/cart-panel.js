import { searchItem, checkIn, searchModel } from '../../lib/api-client';
import { Dispatcher } from 'consus-core/flux';
import CartStore from '../../store/cart-store';

export default class CartController {

    static checkInItem(id, itemAddress) {
        return checkIn(id, itemAddress).then(item => {
            Dispatcher.handleAction('CHECKIN_SUCCESS', {
                itemAddress: item.itemAddress
            });
        }).catch(error => {
            Dispatcher.handleAction('ERROR', {
                error
            });
        });
    }

    static getItem(address) {
        return searchItem(address).then(item => {
            if (item.status === 'CHECKED_OUT')
                return Dispatcher.handleAction('ERROR', {
                    error: 'This item is already checked out by another student.'
                });
            Dispatcher.handleAction("CHECKOUT_ITEM_FOUND", item);
        });
    }

    static getModel(address) {
        return searchModel(address).then(model => {
            if (model.inStock <= 0)
                return Dispatcher.handleAction('ERROR', {
                    error: `${model.name} is out of stock.`
                });
            if(!model.allowCheckout)
                return Dispatcher.handleAction('ERROR', {
                    error: `${model.name} is not available for checkout.`
                });
            Dispatcher.handleAction("CHECKOUT_MODEL_FOUND", model);
        });
    }

    static incrementModel(address) {
        return searchModel(address).then(model => {
            let storeModel = CartStore.getContents().find(content => {
                return content.address === model.address;
            });

            if(storeModel.quantity < model.inStock) {
                Dispatcher.handleAction("CHECKOUT_DUPLICATE_MODEL", model);
            } else {
                return Dispatcher.handleAction('ERROR', {
                    error: `${model.name} is out of stock.`
                });
            }
        });
    }

    static throwError(error){
        Dispatcher.handleAction("ERROR", { error });
    }
}
