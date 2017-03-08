import React from 'react';
import ListenerComponent from '../../lib/listener-component.jsx';
import ModelStore from '../../store/model-store';
import Model from '../components/model.jsx';
import { Link } from 'react-router';

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

    render() {
        return (
            <div id="models">
                <h1>All models</h1>
                <Link to='/models/new'>Make new model</Link>
                {this.state.models.map((model) => {
                    return (
                        <div key={model.address}>
                            <Model
                                model={model}
                                count={model.count}/>
                        </div>
                    );
                })}
            </div>
        );
    }

}
