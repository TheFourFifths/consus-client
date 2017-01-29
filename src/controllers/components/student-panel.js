import { getAllModels, patchItemDueDate } from '../../lib/api-client';
import { Dispatcher } from 'consus-core/flux';
import Moment from 'moment-timezone';
import StudentStore from '../../store/student-store';

export default class StudentPanelController{
    static getModels() {
        return getAllModels().then(models => {
            Dispatcher.handleAction("MODELS_RECEIVED", models);
        });
    }

    static changeDueDate(date, item){
        if(date !== undefined){
            let newDate = Moment.tz(date, 'America/Chicago');
            let itemDate = Moment.tz(item.timestamp * 1000, 'America/Chicago');
            if(newDate.isBefore(itemDate)){
                return Dispatcher.handleAction("ERROR", {
                    error: `The selected date must be after the item's current date!`
                });
            }
            return patchItemDueDate(StudentStore.getStudent().id, item.address, date).then(student => {
                Dispatcher.handleAction("ITEM_DUEDATE_UPDATED", student);
            });
        }
    }
}
