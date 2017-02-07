import { Dispatcher } from 'consus-core/flux';

export default class QrController {

    static promptToPrint(text) {
        Dispatcher.handleAction('PROMPT_TO_PRINT', {
            text
        });
    }

}
