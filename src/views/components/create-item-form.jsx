import React from 'react';
import ListenerComponent from '../../lib/listener-component.jsx';
import ModelStore from '../../store/model-store'
import { createItem } from '../../lib/api-client';

export default class CreateItemForm extends ListenerComponent {

    constructor() {
        super();
    }

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
        createItem(this.state.modelAddress);
    }

    render() {
        return (
            <div className='create-item-form'>
                <h1>Create an Item</h1>
                <form onSubmit={this.submit.bind(this)}>
                    <select onChange={this.changeModel.bind(this)} >
                        {this.state.models.map(function(model, key){
                            return <option key={key} value={model.address}>{ model.name }</option>
                        })}
                    </select><br/>
                    <input type='submit' value='Create Item' />
                </form>
            </div>
        );
    }

}
