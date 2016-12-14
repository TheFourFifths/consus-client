import { createItem } from '../../lib/api-client';
import { hashHistory } from 'react-router';

export default class ItemFormController {
    static createItem(modelAddress) {
        return createItem(modelAddress).then(()=>{
            hashHistory.push('/');
        });
    }
    
    static popNoModelSelectedToast(){
        Dispatcher.handleAction('CREATE_TOAST', {
            text: 'Please select a model.'
        });
    }
}
