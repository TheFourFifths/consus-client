import config from 'config';
import { getAllModels, patchItemDueDate, searchStudent } from '../../lib/api-client';
import { Dispatcher } from 'consus-core/flux';
import moment from 'moment-timezone';
import StudentStore from '../../store/student-store';

export default class StudentPanelController {

    static getModels() {
        return getAllModels().then(models => {
            Dispatcher.handleAction("MODELS_RECEIVED", models);
        });
    }
    static changeItemDueDate(date, item){
        if(this.isValidDueDate(date)){
            return patchItemDueDate(date, item.address, StudentStore.getStudent().id).then(() => {
                return searchStudent(StudentStore.getStudent().id);
            }).then(student => {
                Dispatcher.handleAction("STUDENT_FOUND", student);
            }).catch(e => {
                Dispatcher.handleAction('ERROR', { error: e.message });
            });
        }
    }

    static isValidDueDate(dueDate){
        let today = moment();
        let dueDateMoment = moment.tz(dueDate, config.get('timezone'));
        if(dueDateMoment.isBefore(today)){
            Dispatcher.handleAction('ERROR', {
                error: 'Due date cannot be set to today or past.'
            });
            return false;
        }
        return true;
    }
    static countDuplicateModels(models) {
        let modelCounts = [];
        models.forEach(model => {
            let exists = false;
            modelCounts.forEach(mc => {
                if(model.address === mc.address && !exists){
                    mc.quantity++;
                    exists = true;
                }
            });
            if(!exists){
                modelCounts.push({address: model.address, name: model.name, quantity: 1});
            }
        });
        return modelCounts;
    }

    static throwNotANumberError() {
        Dispatcher.handleAction("ERROR", {
            error: "Input was not a number"
        });
    }

}
