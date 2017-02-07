import { Dispatcher } from 'consus-core/flux';
import PrinterStore from '../../../.dist/store/printer-store';
import { assert } from 'chai';

describe('PrinterStore', () => {

    beforeEach(() => {
        return Dispatcher.handleAction('CLEAR_ALL_DATA');
    });

    it('should instantiate without any text', () => {
        assert.isUndefined(PrinterStore.getText());
    });

    it('should prompt to print', () => {
        Dispatcher.handleAction('PROMPT_TO_PRINT', {
            text: 'm8y7nEtAe'
        });
        assert.strictEqual(PrinterStore.getText(), 'm8y7nEtAe');
    });

});
