import { getAllModels } from '../../lib/api-client';
import { Dispatcher } from 'consus-core/flux';
import { hashHistory } from 'react-router';

export default class ItemController {

    static newItemPage() {
        return getAllModels().then(models => {
            Dispatcher.handleAction("MODELS_RECEIVED", models);
            hashHistory.push('/items/new');
        });
    }

}
