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

        assert.strictEqual(ErrorStore.getTag(), 'ERROR');
        assert.strictEqual(ErrorStore.getError(), 'Some Error');
    });

    it('should store a debug message when one is gotten', () => {
        Dispatcher.handleAction('DEBUG', {
            error: 'Some bug'
        });

        assert.strictEqual(ErrorStore.getTag(), 'DEBUG');
        assert.strictEqual(ErrorStore.getError(), 'Some bug');
    });

    it('should store an info message when one is gotten', () => {
        Dispatcher.handleAction('INFO', {
            error: 'Some info'
        });

        assert.strictEqual(ErrorStore.getTag(), 'INFO');
        assert.strictEqual(ErrorStore.getError(), 'Some info');
    });

    it('should store a warning when one is gotten', () => {
        Dispatcher.handleAction('WARN', {
            error: 'Some warning'
        });

        assert.strictEqual(ErrorStore.getTag(), 'WARN');
        assert.strictEqual(ErrorStore.getError(), 'Some warning');
    });

    it('should clear out error when "clearError" is called', () => {
        Dispatcher.handleAction('ERROR',{
            error: 'Some Error'
        });

        assert.strictEqual(ErrorStore.getError(), 'Some Error');

        Dispatcher.handleAction('CLEAR_ERROR', {});

        assert.isNull(ErrorStore.getTag());
        assert.isNull(ErrorStore.getError());
    });
});
