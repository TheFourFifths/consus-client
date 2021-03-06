import { getAllFaultyItems } from '../../lib/api-client';
import { Dispatcher } from 'consus-core/flux';

export default class BrokenItemsReportController {

    static getFaultyItems() {
        return getAllFaultyItems().then(items => {
            Dispatcher.handleAction('FAULTY_ITEMS_RECEIVED', items);
        });
    }
}
