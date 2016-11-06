import { Dispatcher } from 'consus-core/flux';
import ErrorStore from '../../../.dist/store/error-store.js';
import { assert } from 'chai';

describe('ErrorStore', () => {
    it('should instantiate without an error', () => {
        assert.isNull(ErrorStore.getError());
    });

    it('should store an error when one is gotten', () => {
        Dispatcher.handleAction('ERROR',{
            error: 'Some Error'
        });

        assert.strictEqual(ErrorStore.getError(), 'Some Error');
    });

    it('should clear out error when "clearError" is called', () => {
        Dispatcher.handleAction('ERROR',{
            error: 'Some Error'
        });

        assert.strictEqual(ErrorStore.getError(), 'Some Error');

        ErrorStore.clearError();

        assert.isNull(ErrorStore.getError());
    });
});
