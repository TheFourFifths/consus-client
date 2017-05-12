import React from 'react';
import ListenerComponent from '../../lib/listener-component.jsx';
import ModelStore from '../../store/model-store';
import IndexController from '../../controllers/pages/index';
import Model from '../components/model.jsx';

export default class Models extends ListenerComponent {

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
            models: ModelStore.getAllModels()
        };
    }

    goToNewModel() {
        IndexController.navigateTo(`/models/new`);
    }

    render() {
        return (
            <div id="models">
                <h1>All Models</h1>
                <button className='cool-button' onClick={this.goToNewModel}>Make new Model</button>

                {this.state.models.map((model) => {
                    return (
                        <div key={model.address + model.count}>
                            <Model model={model}/>
                        </div>
                    );
                })}
            </div>
        );
    }

}
