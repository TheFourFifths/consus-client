import { getAllModels } from '../../lib/api-client';
import { Dispatcher } from 'consus-core/flux';


export default class StudentPanelController{
    static getModels() {
        return getAllModels().then(models => {
            Dispatcher.handleAction("MODELS_RECEIVED", models);
        });
    }
}
