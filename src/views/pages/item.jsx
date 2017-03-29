import React from 'react';
import ListenerComponent from '../../lib/listener-component.jsx';
import ItemStore from '../../store/item-store';
import Item from '../components/item.jsx';

export default class SingleItemPage extends ListenerComponent {

    getStores() {
        return [
            ItemStore
        ];
    }

    getState() {
        return {
            item: ItemStore.getItem()
        };
    }

    render() {
        return (
            <Item key={this.state.item.address + '' + this.state.item.faultHistory.length}
            item = {this.state.item} />
        );
    }

}
