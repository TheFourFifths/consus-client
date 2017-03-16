import { searchItem, checkIn} from '../../lib/api-client';
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
            if (item.status === 'CHECKED_OUT') {
                return Dispatcher.handleAction('ERROR', {
                    error: 'This item is already checked out by another student.'
                });
            } else if(CartStore.getItems().some(ele => ele.address === address)){
                return Dispatcher.handleAction('ERROR', {
                    error: 'This item is already in the cart.'
                });
            }
            Dispatcher.handleAction("CHECKOUT_ITEM_FOUND", item);
        });
    }

    static throwError(error){
        Dispatcher.handleAction("ERROR", { error });
    }

    static turnInLostEquipment(equipmentAddress){
        let result = readAddress(equipmentAddress);
        if (result.type === 'model' ) {
            //this is where checkin for model logic would go
        } else if (result.type === 'item'){
            return searchItem(equipmentAddress).then(item => {
                if(item.isCheckedOutTo === null || item.isCheckedOutTo === undefined){
                    Dispatcher.handleAction('ERROR', {
                        error: 'The item is not checked out by anyone.'
                    });
                } else{
                    return CartController.checkInItem(parseInt(item.isCheckedOutTo), item.address);
                }
            });
        }
    }
}
