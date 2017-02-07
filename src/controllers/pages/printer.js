import { Dispatcher } from 'consus-core/flux';
import { hashHistory } from 'react-router';

export default class PrinterController {

    static promptToPrint(text) {
        Dispatcher.handleAction('PROMPT_TO_PRINT', {
            text
        });
        hashHistory.push('/printer');
    }

    static close() {
        hashHistory.goBack();
    }

}
