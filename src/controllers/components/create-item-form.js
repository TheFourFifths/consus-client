import { createItem } from '../../lib/api-client';
import { hashHistory } from 'react-router';

export default class ItemFormController {
    static createItem(modelAddress) {
        createItem(modelAddress).then(()=>{
            hashHistory.push('/');
        });
    }
}
