import React from 'react';
import ListenerComponent from '../../lib/listener-component.jsx';
import Model from '../components/model.jsx';
import Item from '../components/item.jsx';
import ModelStore from '../../store/model-store';
import ItemStore from '../../store/item-store';

export default class ModelPage extends ListenerComponent {

    constructor() {
        super();
    }

    getStores() {
        return [
            ModelStore,
            ItemStore
        ];
    }

    getState() {
        return {
            model: ModelStore.getModel(),
            items: ItemStore.getAllItems()
        };
    }

    render() {
        return (
            <div>
                <Model model={this.state.model}/>
                {this.state.items.map((item) => {
                    return (
                        <div key={'' + item.address + item.faultHistory.length}>
                            <Item item={item} />
                        </div>
                    );
                })}
            </div>
        );
    }
}
