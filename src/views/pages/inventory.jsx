import React from 'react';
import ListenerComponent from '../../lib/listener-component.jsx';
import ItemStore from '../../store/item-store';
import ItemList from '../components/item-list.jsx';

export default class InventoryPage extends ListenerComponent {

    constructor(props){
        super(props);

        let items = {};
        ItemStore.getAllItems().forEach(item => items[item.address] = item);

        this.state = {
            unscannedItems: items,
            scannedItems: {}
        }
    }

    componentWillMount(){
        document.addEventListener("keydown", this.handleScan.bind(this));
    }

    componentWillUnmount(){
        document.removeEventListener("keydown", this.handleScan.bind(this));
    }

    handleScan(event){
        if (event.keyCode !== 13/*(enter key)*/) return;
        let scannedItems = this.state.scannedItems;
        let unscannedItems = this.state.unscannedItems;
        scannedItems[this.refs.inventoryInput.value] = unscannedItems[this.refs.inventoryInput.value];
        delete(unscannedItems[this.refs.inventoryInput.value]);
        this.setState({scannedItems, unscannedItems});
        this.refs.inventoryInput.value = '';
    }

    render() {
        return (
            <div>
                <input ref="inventoryInput" autoFocus={true}/><br />
                <div className="left">
                    <h1>Unscanned</h1>
                    <ItemList items={this.state.unscannedItems}/>
                </div>
                <div className="right">
                    <h1>Scanned</h1>
                    <ItemList items={this.state.scannedItems}/>
                </div>
            </div>
        );
    }

}
