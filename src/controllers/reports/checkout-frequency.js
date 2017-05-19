import { getAllModels, getAllItems } from '../../lib/api-client';
import { Dispatcher } from 'consus-core/flux';

export default class CheckoutFrequencyReportPageController {
    static getAllItems() {
        return Promise.all([getAllItems(), getAllModels()]).then(results => {
            Dispatcher.handleAction("MODELS_RECEIVED", results[1]);
            Dispatcher.handleAction("ITEMS_RECEIVED", results[0]);
        });
    }
}
