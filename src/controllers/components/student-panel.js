import config from 'config';
import { getAllModels, retrieveItem, retrieveModel, saveItem, saveModel, patchItemDueDate, searchStudent } from '../../lib/api-client';
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
        if(dueDate === undefined || dueDate === null){
            return false;
        }
        let today = moment();
        let dueDateMoment = moment.tz(dueDate, config.get('timezone'));
        today.hour(0).minute(0).second(0);
        dueDateMoment.hour(1);
        if(!dueDateMoment.isSameOrAfter(today)){
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

    static retrieveItem(itemAddress) {
        return retrieveItem(itemAddress).then(() => {
            Dispatcher.handleAction('RETRIEVE_ITEM', {
                itemAddress
            });
        });
    }

    static retrieveModel(studentId, modelAddress) {
        return retrieveModel(studentId, modelAddress).then(() => {
            Dispatcher.handleAction('RETRIEVE_MODEL', {
                modelAddress
            });
        });
    }

    static saveItem(itemAddress) {
        return saveItem(itemAddress).then(() => {
            Dispatcher.handleAction('SAVE_ITEM', {
                itemAddress
            });
            return searchStudent(StudentStore.getStudent().id);
        }).then(student => {
            Dispatcher.handleAction('STUDENT_FOUND', student);
        });
    }

    static saveModel(studentId, modelAddress) {
        return saveModel(studentId, modelAddress).then(() => {
            Dispatcher.handleAction('SAVE_MODEL', {
                modelAddress
            });
            return searchStudent(StudentStore.getStudent().id);
        }).then(student => {
            Dispatcher.handleAction('STUDENT_FOUND', student);
        });
    }

}
