import { getAllModels, saveItem, saveModel } from '../../lib/api-client';
import { Dispatcher } from 'consus-core/flux';

export default class StudentPanelController {

    static getModels() {
        return getAllModels().then(models => {
            Dispatcher.handleAction("MODELS_RECEIVED", models);
        });
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

    static reserveItem(itemAddress) {
        return saveItem(itemAddress).then(() => {
            Dispatcher.handleAction('SAVE_ITEM', {
                itemAddress
            });
        });
    }

    static reserveModel(studentId, modelAddress) {
        return saveModel(studentId, modelAddress).then(() => {
            Dispatcher.handleAction('SAVE_MODEL', {
                studentId,
                modelAddress
            });
        });
    }

}
