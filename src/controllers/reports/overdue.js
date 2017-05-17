import { getAllModels, getOverdueItems } from '../../lib/api-client';
import { Dispatcher } from 'consus-core/flux';

export default class OverdueItemReportPageController {
    static getOverdueItems() {
        return Promise.all([getOverdueItems(), getAllModels()]).then(results => {
            Dispatcher.handleAction("MODELS_RECEIVED", results[1]);
            Dispatcher.handleAction("OVERDUE_ITEMS_RECEIVED", results[0]);
        });
    }
}
