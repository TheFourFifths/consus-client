import { getOverdueItems } from '../../lib/api-client';
import { Dispatcher } from 'consus-core/flux';

export default class OverdueItemsController {
    static getOverdueItems() {
        return getOverdueItems().then(items => {
            console.log('Got Overdue:', items);
            Dispatcher.handleAction("OVERDUE_ITEMS_RECEIVED", items);
        });
    }
}
