import { Dispatcher } from 'consus-core/flux';
import ToastStore from '../../../.dist/store/toast-store';
import { assert } from 'chai';

describe('ToastStore', () => {

    beforeEach(() => {
        Dispatcher.handleAction('CLEAR_ALL_DATA');
        Dispatcher.handleAction('CREATE_TOAST', {
            text: 'A'
        });
        Dispatcher.handleAction('CREATE_TOAST', {
            text: 'B'
        });
        Dispatcher.handleAction('CREATE_TOAST', {
            text: 'C'
        });
    });

    it('should add a toast message', () => {
        assert.lengthOf(ToastStore.getToasts(), 3);
        Dispatcher.handleAction('CREATE_TOAST', {
            text: 'D'
        });
        assert.lengthOf(ToastStore.getToasts(), 4);
        assert.strictEqual(ToastStore.getToasts()[3].id, 3);
        assert.strictEqual(ToastStore.getToasts()[3].text, 'D');
    });

    it('should have a default timeout of 5 seconds', () => {
        assert.lengthOf(ToastStore.getToasts(), 3);
        Dispatcher.handleAction('CREATE_TOAST', {
            text: 'D'
        });
        assert.strictEqual(ToastStore.getToasts()[3].timeout, 5000);
    });

    it('should be able to define the timeout', () => {
        assert.lengthOf(ToastStore.getToasts(), 3);
        Dispatcher.handleAction('CREATE_TOAST', {
            text: 'D',
            timeout: 1234
        });
        assert.strictEqual(ToastStore.getToasts()[3].timeout, 1234);
    });

    it('should pop the first toast message', () => {
        Dispatcher.handleAction('POP_TOAST', {
            id: 0
        });
        assert.lengthOf(ToastStore.getToasts(), 2);
        assert.strictEqual(ToastStore.getToasts()[0].text, 'B');
        assert.strictEqual(ToastStore.getToasts()[1].text, 'C');
    });

    it('should pop the second toast message', () => {
        Dispatcher.handleAction('POP_TOAST', {
            id: 1
        });
        assert.lengthOf(ToastStore.getToasts(), 2);
        assert.strictEqual(ToastStore.getToasts()[0].text, 'A');
        assert.strictEqual(ToastStore.getToasts()[1].text, 'C');
    });

    it('should pop the last toast message', () => {
        Dispatcher.handleAction('POP_TOAST', {
            id: 2
        });
        assert.lengthOf(ToastStore.getToasts(), 2);
        assert.strictEqual(ToastStore.getToasts()[0].text, 'A');
        assert.strictEqual(ToastStore.getToasts()[1].text, 'B');
    });

    it('should pop all toast messages', () => {
        Dispatcher.handleAction('POP_TOAST', {
            id: 0
        });
        Dispatcher.handleAction('POP_TOAST', {
            id: 1
        });
        Dispatcher.handleAction('POP_TOAST', {
            id: 2
        });
        assert.lengthOf(ToastStore.getToasts(), 0);
    });

    it('should add a toast message when creating a new item', () => {
        Dispatcher.handleAction('ITEM_CREATED', {
            address: 'iGwEZUvfA',
            modelName: 'Resistor'
        });
        assert.lengthOf(ToastStore.getToasts(), 4);
        assert.match(ToastStore.getToasts()[3].text, /Created a new Resistor/);
    });

});