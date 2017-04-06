import { searchItem, checkIn, searchModel } from '../../lib/api-client';
import { Dispatcher } from 'consus-core/flux';
import CartStore from '../../store/cart-store';
import { readAddress } from 'consus-core/identifiers';
export default class CartController {

    static checkInItem(id, itemAddress) {
        return checkIn(id, itemAddress).then(data => {
            Dispatcher.handleAction('CHECKIN_SUCCESS', {
                itemAddress: data.itemAddress,
                modelName: data.modelName
            });
        }).catch(error => {
            Dispatcher.handleAction('ERROR', {
                error
            });
        });
    }

    static getItem(address) {
        return searchItem(address).then(item => {
            if (item.status === 'CHECKED_OUT' || item.status === 'SAVED') {
                return Dispatcher.handleAction('INFO', {
                    info: 'Another student checked out this item.'
                });
            } else if(CartStore.getContents().some(ele => ele.address === address)){
                return Dispatcher.handleAction('INFO', {
                    info: 'This item is already in the cart.'
                });
            }
            Dispatcher.handleAction("CHECKOUT_ITEM_FOUND", item);
        });
    }

    static getModel(address) {
        return searchModel(address).then(model => {
            if(!model.allowCheckout) {
                return Dispatcher.handleAction('WARN', {
                    warn: `${model.name} is unavailable for checkout.`
                });
            }
            if (model.inStock <= 0) {
                return Dispatcher.handleAction('INFO', {
                    info: `${model.name} is out of stock.`
                });
            }
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
                return Dispatcher.handleAction('INFO', {
                    info: `${model.name} is out of stock.`
                });
            }
        });
    }

    static throwError(error) {
        Dispatcher.handleAction("ERROR", { error });
    }

    static turnInLostEquipment(equipmentAddress) {
        let result = readAddress(equipmentAddress);
        if (result.type === 'model' ) {
            //this is where checkin for model logic would go
        } else if (result.type === 'item'){
            return searchItem(equipmentAddress).then(item => {
                if(item.isCheckedOutTo === null || item.isCheckedOutTo === undefined){
                    Dispatcher.handleAction('INFO', {
                        info: 'The item is not currently checked out.'
                    });
                } else{
                    return CartController.checkInItem(parseInt(item.isCheckedOutTo), item.address);
                }
            });
        }
    }

    static changeIsLongterm(isLongterm) {
        Dispatcher.handleAction('EDIT_IS_LONGTERM', {
            isLongterm
        });
    }
    static changeLongtermDate(dueDate) {
        Dispatcher.handleAction('EDIT_LONGTERM_DUEDATE', {
            dueDate
        });
    }

    static changeLongtermProfessor(professor) {
        Dispatcher.handleAction('EDIT_LONGTERM_PROFESSOR', {
            professor
        });
    }
}
