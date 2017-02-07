import { Dispatcher } from 'consus-core/flux';
import { hashHistory } from 'react-router';

export default class PrinterController {

    static promptToPrint(text) {
        Dispatcher.handleAction('PROMPT_TO_PRINT', {
            text
        });
    }

    static close() {
        Dispatcher.handleAction('CLOSE_PRINTER');
    }

}
