import { Dispatcher } from 'consus-core/flux';

export default class ToastsController{
    static popToast(id){
        Dispatcher.handleAction('POP_TOAST', {
            id
        });
    }
}
