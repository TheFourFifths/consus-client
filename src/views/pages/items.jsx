import React from 'react';
import ListenerComponent from '../../lib/listener-component.jsx';
import ItemStore from '../../store/item-store.js';
import { viewModel } from '../../lib/api-client.js'
import Item from '../components/item.jsx';
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
            items: ItemStore.getAllItems()
        };
    }
    render() {
        return (
            <div id="item">
                <h1>All Items</h1>
                <button>Make new Item</button>
                {this.state.items.map(((item, key) => {
                    return <div key={key}>
                        <Item item={item} />
                    </div>
                }))}
            </div>
        );
    }

}
