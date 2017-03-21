import { createItem } from '../../lib/api-client';
import { hashHistory } from 'react-router';
import { Dispatcher } from 'consus-core/flux';

export default class ItemFormController {

    static createItem(modelAddress) {
        return createItem(modelAddress).then(data => {
            hashHistory.push('/items');
            Dispatcher.handleAction('ITEM_CREATED', data);
        }).catch(e => {
            Dispatcher.handleAction('ERROR', { error: e.message });
        });
    }

    static popNoModelSelectedToast(){
        Dispatcher.handleAction('CREATE_TOAST', {
            text: 'Please select a model.'
        });
    }

}
