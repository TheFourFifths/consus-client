import { searchItem, checkInItem} from '../../lib/api-client';
import { Dispatcher } from 'consus-core/flux';
import { hashHistory } from 'react-router';
import StudentStore from '../../store/student-store';

export default class CartController {
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
    
    static checkIn(id, itemAddress) {
        
    }
}
