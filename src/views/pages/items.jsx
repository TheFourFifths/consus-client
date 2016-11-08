import React from 'react';
import ListenerComponent from '../../lib/listener-component.jsx';
import ItemStore from '../../store/item-store.js';
import { hashHistory } from 'react-router';
export default class Models extends ListenerComponent {

    constructor() {
        super();

    }
    getStores() {
        return [
            ItemStore
        ];
    }
    getState() {
        return {
            models: ItemStore.getAllItems()
        };
    }
    render() {
        return (
            <div id="item">
                <h1>All Item</h1>
                <button>Make new Item</button>
                {this.state.models.map(function(item, key){
                    return <div key={key} className="item">
                        {item.address}
                    </div>

                })}
            </div>
        );
    }

}
