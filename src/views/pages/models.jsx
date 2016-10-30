import React from 'react';
import ListenerComponent from '../../lib/listener-component.jsx';
import ModelStore from '../../store/model-store.js';
import CreateModelForm from '../components/create-model-form.jsx';
import { getAllModels } from '../../lib/api-client'
export default class Models extends ListenerComponent {

    constructor() {
        super();
        getAllModels

    }
    getStores() {
        return [
            ModelStore
        ];
    }
    getState() {
        return {
            models: ModelStore.getAllModels()
        };
    }
    render() {
        return (
            <div id="models">
                <h1>All models</h1>
                {this.state.models.map(function(model, key){
                    return <div key={key}>
                        <i><h2>{model.name}</h2></i>
                        <strong>Description: {model.description}</strong><br />
                        <strong>Faulty: {model.isFaulty}, {model.faultDescription}</strong>
                        Address: {model.address}, Location: {model.location}, Price: {model.price}
                    </div>
                })}
            </div>
        );
    }

}
