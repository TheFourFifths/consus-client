import { getModelAndItems } from '../../lib/api-client';
import { Dispatcher } from 'consus-core/flux';
import { hashHistory } from 'react-router';

export default class ModelPageController {

    static getModelAndItems(modelAddress) {
        return getModelAndItems(modelAddress).then(data => {
            Dispatcher.handleAction("MODEL_FOUND", data.model);
            Dispatcher.handleAction("ITEMS_RECEIVED", data);
            hashHistory.push('/model');
        }).catch(() => {
            Dispatcher.handleAction("ERROR", { error: 'The model requested does not exist' });
        });
    }

}
