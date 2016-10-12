import { Dispatcher } from 'consus-flux';
import ModelStore from '../../../.dist/store/model-store';
import { assert } from 'chai';

describe('ModelStore', () => {

    it('should instantiate without a model', () => {
        assert.strictEqual(ModelStore.getModel(), null);
    });

    it('should update a model', () => {
        Dispatcher.handleAction({
            type: 'MODEL_FOUND',
            data: {
                id: 'ABC',
                name: 'A model'
            }
        });
        assert.strictEqual(ModelStore.getModel().id, 'ABC');
        assert.strictEqual(ModelStore.getModel().name, 'A model');
    });

    it('should handle no-model', () => {
        Dispatcher.handleAction({
            type: 'NO_MODEL_FOUND'
        });
        assert.strictEqual(ModelStore.getModel(), null);
    });

});
