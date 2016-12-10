import React from 'react';
import ListenerComponent from '../../lib/listener-component.jsx';
import ItemStore from '../../store/item-store';
import Item from '../components/item.jsx';
import ItemController from '../../controllers/pages/items';

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

    render() {
        return (
            <div id="item">
                <h1>All Items</h1>
                <button onClick={ItemController.newItem}>Make new Item</button>
                {this.state.items.map((item) => {
                    return (
                        <div key={item.address}>
                            <Item item={item} />
                        </div>
                    );
                })}
            </div>
        );
    }

}
