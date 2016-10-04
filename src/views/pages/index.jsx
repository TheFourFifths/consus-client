import React from 'react';
import ItemStore from '../../store/item-store';
import ModelStore from '../../store/model-store';

import ListenerComponent from '../../lib/listener-component.jsx';
import CreateItemForm from '../components/create-item-form.jsx';
import CreateModelForm from '../components/create-model-form.jsx';
import SearchItemForm from '../components/search-item-form.jsx';
import SearchModelForm from '../components/search-model-form.jsx';
import Item from '../components/item.jsx';
import Model from '../components/model.jsx';

export default class Index extends ListenerComponent {

    constructor() {
        super();
    }

    getStores() {
        return [
            ItemStore,
            ModelStore
        ];
    }

    getState() {
        return {
            item: ItemStore.getItem(),
            model: ModelStore.getModel()
        };
    }

    render() {
        return (
            <div id='index'>
                <CreateItemForm />
                <CreateModelForm />
                <SearchItemForm />
                <Item item={this.state.item} />
                <SearchModelForm />
                <Model model={this.state.model} />
            </div>
        );
    }

}
