import React from 'react';
import ListenerComponent from '../../lib/listener-component.jsx';
import ModelStore from '../../store/model-store.js';

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
                {this.state.models.map(function(model, key){
                    return <div key={key} className="model">
                        <div className="picArea">
                            <img src="../src/imgs/placeholder.jpg" />
                        </div>
                        <div className="titleArea">
                            <h2>{model.name}</h2>
                            <i className="address">{model.address}</i>
                        </div>
                        <div className="infoArea">
                            <div className="descriptionArea">
                                <h3>Description</h3>
                                <p>{model.description}</p>
                            </div>
                            <div className="faultArea">
                                <h3>Fault</h3>
                                {(model.isFaulty
                                        ? <p>{model.faultDescription}</p>
                                        : <p>Model is not faulty.</p>
                                )}
                            </div>
                            <div className="miscArea">
                                <b>Location:</b> {model.location}<br/>
                                <b>Price:</b> ${model.price}<br/>
                                <b>Manufacturer:</b> {model.manufacturer}<br/>
                                <b>Vendor:</b> {model.vendor}<br/>
                                <b>Quantity:</b> {model.count}<br/>
                            </div>
                        </div>
                        <div className="actionArea">
                            <img src="../src/imgs/plus.png" />
                            <img src="../src/imgs/edit.png" />
                            <img src="../src/imgs/trashcan.png" />
                        </div>
                        <div className="clear"> </div>
                    </div>

                })}
            </div>
        );
    }

}
