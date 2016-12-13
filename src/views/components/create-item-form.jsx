import React from 'react';
import ListenerComponent from '../../lib/listener-component.jsx';
import ModelStore from '../../store/model-store'
import ItemFormController from '../../controllers/components/create-item-form';

export default class CreateItemForm extends ListenerComponent {

    getStores() {
        return [
            ModelStore
        ];
    }

    getState() {
        return {
            modelAddress: '',
            models: ModelStore.getAllModels()
        };
    }

    changeModel(e) {
        this.setState({
            modelAddress: e.target.value,
            models: this.state.models
        });
    }

    submit(e) {
        e.preventDefault();
        ItemFormController.createItem(this.state.modelAddress);
    }

    render() {
        return (
            <div className='create-item-form'>
                <h1>Create an Item</h1>
                <form onSubmit={this.submit.bind(this)}>
                    <select onChange={this.changeModel.bind(this)} >
                        {this.state.models.map((model, key) => {
                            return <option key={key} value={model.address}>{ model.name }</option>
                        })}
                    </select><br/>
                    <input type='submit' value='Create Item' />
                </form>
            </div>
        );
    }

}
