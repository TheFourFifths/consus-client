import { getAllItems, getAllModels, getAllStudents } from '../../lib/api-client';
import { Dispatcher } from 'consus-core/flux';

export default class CurrentlyCheckedOutReportPageController {
    static getAllItems() {
        return Promise.all([getAllItems(), getAllModels(), getAllStudents()]).then(results => {
            Dispatcher.handleAction("MODELS_RECEIVED", results[1]);
            Dispatcher.handleAction("STUDENTS_FOUND", results[2]);
            Dispatcher.handleAction("ITEMS_RECEIVED", results[0]);
        });
    }
}
