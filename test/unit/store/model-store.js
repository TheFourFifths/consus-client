import { Dispatcher } from 'consus-core/flux';
import ModelStore from '../../../.dist/store/model-store';
import { assert } from 'chai';

describe('ModelStore', () => {

    beforeEach(() => {
        return Dispatcher.handleAction('CLEAR_ALL_DATA');
    });

    it('should instantiate without a model', () => {
        assert.strictEqual(ModelStore.getModel(), null);
    });

    it('should get a model', () => {
        Dispatcher.handleAction('MODEL_FOUND', {
            address: 'ABC',
            name: 'A model'
        });
        assert.strictEqual(ModelStore.getModel().address, 'ABC');
        assert.strictEqual(ModelStore.getModel().name, 'A model');
    });

    it('should handle no-model', () => {
        Dispatcher.handleAction('NO_MODEL_FOUND');
        assert.strictEqual(ModelStore.getModel(), null);
    });

    it('should get all models', () => {
        Dispatcher.handleAction('MODELS_RECEIVED',{
            models:[{
                name: 'test1'
            },{
                name: 'test2'
            },{
                name: 'test3'
            }]
        });
        assert.strictEqual(ModelStore.getAllModels().length, 3);
    });

    it('should handle new model created', () =>{
        Dispatcher.handleAction('MODEL_CREATED', {
            address: 'ABC',
            name: 'A model'
        });
        assert.strictEqual(ModelStore.getAllModels().length, 1);
    });

    it('should get model by address', () => {
        Dispatcher.handleAction(Dispatcher.handleAction('MODELS_RECEIVED',{
            models:[{
                name: 'test1',
                address: 'abc123'
            },{
                name: 'test2',
                address: '123abc'
            },{
                name: 'test3',
                address: 'address'
            }]
        }));
        let model = ModelStore.getModelByAddress('abc123');
        assert.strictEqual(model.name, 'test1');
    });

});
