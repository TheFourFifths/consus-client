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
            <div id="inventory-system">
                <label htmlFor="inv-input">Scan or Enter Address Here:</label>
                <input id="inv-input" ref="inventoryInput" autoFocus={true}/>
                <button> Done Taking Inventory </button>
                <br />
                <div className="left list-container">
                    <h1>Unscanned</h1>
                    {Object.keys(this.state.unscannedItems).length === 0 ?
                        <p className='item-list'>All inventory items have been accounted for!</p>:
                        <ItemList items={this.state.unscannedItems}/>}
                </div>
                <div className="right list-container">
                    <h1>Scanned</h1>
                    {Object.keys(this.state.scannedItems).length === 0 ?
                         <p className='item-list'>Start scanning items to begin taking inventory</p>:
                         <ItemList items={this.state.scannedItems}/>}
                </div>
                <br className="clear" />
                <p className="center">TIP: If Scanner isn't working, try clicking in the input box.</p>
            </div>
        );
    }

}
