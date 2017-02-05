import { getAllModels, patchItemDueDate } from '../../lib/api-client';
import { Dispatcher } from 'consus-core/flux';
import StudentStore from '../../store/student-store';

export default class StudentPanelController{
    static getModels() {
        return getAllModels().then(models => {
            Dispatcher.handleAction("MODELS_RECEIVED", models);
        });
    }

    static changeDueDate(date, item){
        if(date !== undefined){
            return patchItemDueDate(StudentStore.getStudent().id, item.address, date).then(student => {
                Dispatcher.handleAction("ITEM_DUEDATE_UPDATED", student);
            });
        }
    }
}
