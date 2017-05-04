import { Dispatcher } from 'consus-core/flux';
import PrinterStore from '../../../.dist/store/printer-store';
import { assert } from 'chai';

describe('PrinterStore', () => {

    before(() => {
        return Dispatcher.handleAction('CLEAR_ALL_DATA');
    });

    it('should instantiate without any addresses', () => {
        assert.deepEqual(PrinterStore.getAddresses(), []);
    });

    it('should add an address', () => {
        Dispatcher.handleAction('ADD_ADDRESS', {
            address: 'm8y7nEtAe'
        });
        assert.deepEqual(PrinterStore.getAddresses(), ['m8y7nEtAe']);
    });

    it('should add another address', () => {
        Dispatcher.handleAction('ADD_ADDRESS', {
            address: 'iGwEZVeaT'
        });
        assert.deepEqual(PrinterStore.getAddresses(), ['m8y7nEtAe', 'iGwEZVeaT']);
    });

    it('should remove an address', () => {
        Dispatcher.handleAction('REMOVE_ADDRESS', {
            address: 'm8y7nEtAe'
        });
        assert.deepEqual(PrinterStore.getAddresses(), ['iGwEZVeaT']);
    });

});
