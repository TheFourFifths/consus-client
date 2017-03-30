import config from 'config';
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

    it('should add a toast message for successful checkins', () => {
        Dispatcher.handleAction('STUDENT_FOUND', {
            id: 123456,
            name: 'Pope Francis',
            items: []
        });
        Dispatcher.handleAction('CHECKOUT_ITEM_FOUND', {
            address: '123',
            status: 'AVAILABLE'
        });
        Dispatcher.handleAction('CHECKIN_SUCCESS', {
            itemAddress: '123',
            modelName: 'Resistor'
        });
        assert.lengthOf(ToastStore.getToasts(), 4);
        assert.strictEqual(ToastStore.getToasts()[3].text, 'Item checked in successfully: Resistor (123)');
    });


    it('should add a toast message for successful checkouts', () => {
        Dispatcher.handleAction('STUDENT_FOUND', {
            id: 123456,
            name: 'Pope Francis',
            items: []
        });
        Dispatcher.handleAction('CHECKOUT_ITEM_FOUND', {
            address: '123',
            status: 'AVAILABLE'
        });
        Dispatcher.handleAction('CHECKOUT_SUCCESS');
        assert.lengthOf(ToastStore.getToasts(), 4);
        assert.strictEqual(ToastStore.getToasts()[3].text, 'Checkout completed successfully!');
    });

    it("should have a default timeout of whatever's in the config file", () => {
        assert.lengthOf(ToastStore.getToasts(), 3);
        Dispatcher.handleAction('CREATE_TOAST', {
            text: 'D'
        });
        assert.strictEqual(ToastStore.getToasts()[3].timeout, config.get('toast.timeout') * 1000);
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

    it('should add a toast message for creating new models', () => {
        Dispatcher.handleAction('MODEL_CREATED', {
            name: 'Car Radio',
            description: 'Somebody stole my car radio, so now I sit in silence'
        });
        assert.lengthOf(ToastStore.getToasts(), 4);
        assert.match(ToastStore.getToasts()[3].text, /Created a new Car Radio/);
    });

    it('should add a toast message when creating a new item', () => {
        Dispatcher.handleAction('ITEM_CREATED', {
            address: 'iGwEZUvfA',
            modelName: 'Resistor'
        });
        assert.lengthOf(ToastStore.getToasts(), 4);
        assert.match(ToastStore.getToasts()[3].text, /item added: Resistor \(iGwEZUvfA\)/);
    });

    it('should add a toast message for deleting an item', () => {
        let itemAddress = 'test';
        let modelName = 'vroom';
        Dispatcher.handleAction('ITEM_DELETED', {
            itemAddress: itemAddress,
            modelName: modelName
        });
        assert.lengthOf(ToastStore.getToasts(), 4);
        assert.strictEqual(ToastStore.getToasts()[3].text, `${modelName} ${itemAddress} was deleted!`);
    });

    it('should add a toast if admin code is wrong', () => {
        Dispatcher.handleAction('INVALID_CODE');
        assert.lengthOf(ToastStore.getToasts(), 4);
        assert.match(ToastStore.getToasts()[3].text, /Invalid Admin Code/);
    });

    it('should add a toast when students are uploaded', () => {
        Dispatcher.handleAction('STUDENTS_UPLOADED');
        assert.lengthOf(ToastStore.getToasts(), 4);
        assert.strictEqual(ToastStore.getToasts()[3].text, 'Students uploaded successfully');
    });

    it('should add a toast when students failed to uploaded', () => {
        Dispatcher.handleAction('FILE_UNSUPPORTED');
        assert.lengthOf(ToastStore.getToasts(), 4);
        assert.strictEqual(ToastStore.getToasts()[3].text, 'Unknown file extension. File must be in Excel format!');
    });

    it('should add a toast when a model is updated', () => {
        let modelName = 'What a name';
        let modelAddress = 'Wowza';
        Dispatcher.handleAction('MODEL_UPDATED', {
            name: modelName,
            address: modelAddress

        });
        assert.lengthOf(ToastStore.getToasts(), 4);
        assert.strictEqual(ToastStore.getToasts()[3].text, `${modelName} (${modelAddress}) was updated!`);
    });

    it('should add toast when model is deleted', () => {
        let modelName = 'testerino';
        let modelAddress = 'not really an address';
        Dispatcher.handleAction('MODEL_DELETED', {
            name: modelName,
            address: modelAddress
        });
        assert.lengthOf(ToastStore.getToasts(), 4);
        assert.strictEqual(ToastStore.getToasts()[3].text, `${modelName} (${modelAddress}) was deleted`)
    });

    it('should add toast when an unserialized model is created', () => {
        let modelName = 'Better than jordans model test name';
        let modelAddress = 'really not an address';
        Dispatcher.handleAction('UNSERIALIZED_MODEL_ADDED', {
            name: modelName,
            address: modelAddress
        });
        assert.lengthOf(ToastStore.getToasts(), 4);
        assert.strictEqual(ToastStore.getToasts()[3].text, `New ${modelName} (${modelAddress}) created`)
    });

});
