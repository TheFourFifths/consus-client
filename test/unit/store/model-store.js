import { Dispatcher } from 'consus-core/flux';
import ModelStore from '../../../.dist/store/model-store';
import { assert } from 'chai';

describe('ModelStore', () => {
    before(() => {
        return Dispatcher.handleAction('CLEAR_ALL_DATA');
    });

    it('should instantiate without a model', () => {
        assert.strictEqual(ModelStore.getModel(), null);
    });

    it('should get a model', () => {
        Dispatcher.handleAction('MODEL_FOUND', {
            id: 'ABC',
            name: 'A model'
        });
        assert.strictEqual(ModelStore.getModel().id, 'ABC');
        assert.strictEqual(ModelStore.getModel().name, 'A model');
    });

    it('should handle no-model', () => {
        Dispatcher.handleAction('NO_MODEL_FOUND');
        assert.strictEqual(ModelStore.getModel(), null);
    });

});
