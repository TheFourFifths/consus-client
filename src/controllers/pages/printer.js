import { Dispatcher } from 'consus-core/flux';
import { hashHistory } from 'react-router';

export default class PrinterController {

    static promptToPrint(address) {
        Dispatcher.handleAction('ADD_ADDRESS', {
            address
        });
        hashHistory.push('/printer');
    }

    static close() {
        hashHistory.goBack();
    }

    static remove(address) {
        Dispatcher.handleAction('REMOVE_ADDRESS', {
            address
        });
    }

}
