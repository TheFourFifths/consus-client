import React from 'react';
import ListenerComponent from '../../lib/listener-component.jsx';
import ItemStore from '../../store/item-store';
import { getModelsForNewItem,  viewModel } from '../../lib/api-client'
import Item from '../components/item.jsx';

export default class Models extends ListenerComponent {

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

    newItem(e) {
        getModelsForNewItem();
    }

    render() {
        return (
            <div id="item">
                <h1>All Items</h1>
                <button onClick={this.newItem}>Make new Item</button>
                {this.state.items.map((item, key) => {
                    return (
                        <div key={key}>
                            <Item item={item} />
                        </div>
                    );
                })}
            </div>
        );
    }

}
