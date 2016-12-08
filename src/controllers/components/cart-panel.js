import { searchItem, checkIn} from '../../lib/api-client';
import { Dispatcher } from 'consus-core/flux';
import StudentStore from '../../store/student-store';

export default class CartController {
        
    static checkInItem(id, itemAddress) {
        checkIn(id, itemAddress).then(item => {
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
        if(StudentStore.getStudent().hasOverdueItem)
            return Dispatcher.handleAction('ERROR', {
                error:'Student has at least one overdue item.'
            });

        searchItem(address).then(item => {
            if (item.status === 'CHECKED_OUT')
                return Dispatcher.handleAction('ERROR', {
                    error: 'This item is already checked out by another student.'
                });
            Dispatcher.handleAction("CHECKOUT_ITEM_FOUND", item);
        });
    }
    
    static throwError(error){
        Dispatcher.handleAction("ERROR", { error });
    }
}
