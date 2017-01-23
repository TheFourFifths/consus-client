import { getAllModels } from '../../lib/api-client';
import { Dispatcher } from 'consus-core/flux';


export default class StudentPanelController{
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
}
