import { checkOutItems, searchStudent } from '../../lib/api-client';
import { Dispatcher } from 'consus-core/flux';
import AuthStore from '../../store/authentication-store';

export default class StudentController{
    static acceptAdminModal(adminCode){
        if (adminCode.length > 0)
            Dispatcher.handleAction("ADMIN_CODE_ENTERED", {adminCode});
    }

    static cancelAdminModal(){
        Dispatcher.handleAction("CLEAR_ADMIN_WINDOW");
    }

    static cancelCheckout() {
        Dispatcher.handleAction('CLEAR_ITEMS');
    }

    static checkout(id, items) {
        return checkOutItems(id, items, AuthStore.getAdminCode()).then(() => {
            return searchStudent(id).then(student => {
                Dispatcher.handleAction('CHECKOUT_SUCCESS');
                Dispatcher.handleAction("STUDENT_FOUND", student);
            });
        }).catch(error => {
            if (error === 'Student has overdue item'){
                Dispatcher.handleAction('OVERRIDE_REQUIRED');
            }else if(error === 'Invalid Admin'){
                Dispatcher.handleAction('CLEAR_ADMIN_CODE');
            }else{
                Dispatcher.handleAction('ERROR', {
                    error
                });
            }
        });
    }

    static throwNoItemsError() {
        Dispatcher.handleAction('ERROR', {
            error: 'No Items were scanned for checkout.'
        });
    }
}
