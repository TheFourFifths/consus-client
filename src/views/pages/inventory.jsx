import React from 'react';
import ListenerComponent from '../../lib/listener-component.jsx';
import ItemStore from '../../store/item-store';
import ItemList from '../components/item-list.jsx';
import { Dispatcher } from 'consus-core/flux';

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
        if (!this.state.unscannedItems[this.refs.inventoryInput.value]){
                if (!this.state.scannedItems[this.refs.inventoryInput.value]){
                    let text = "Invalid Item Barcode Scanned: " + this.refs.inventoryInput.value
                    Dispatcher.handleAction('CREATE_TOAST', {
                        text
                    });
                }
                this.refs.inventoryInput.value = '';
                return;
        }
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
                <h1 className="print-only">Missing Inventory</h1>
                <span className="left no-print">
                    <label htmlFor="inv-input">Scan or Enter Address Here: </label><br/>
                    <input id="inv-input" ref="inventoryInput" autoFocus={true}/>
                </span>
                <button className="right no-print cool-button" onClick={window.print}>Print Remaining Unscanned Inventory</button>
                <br className="clear no-print"/>
                <div className="left unscanned list-container bigger-text">
                    <h2 className="no-print">Unscanned</h2>
                    {Object.keys(this.state.unscannedItems).length === 0 ?
                        <p className='item-list'>All inventory items have been accounted for!</p>:
                        <ItemList items={this.state.unscannedItems}/>}
                </div>
                <div className="right no-print list-container bigger-text">
                    <h2>Scanned</h2>
                    {Object.keys(this.state.scannedItems).length === 0 ?
                         <p className='item-list'>Start scanning items to begin taking inventory</p>:
                         <ItemList items={this.state.scannedItems}/>}
                </div>
                <br className="clear" />
                <p className="center no-print bigger-text">TIP: If Scanner isn't working, try clicking in the input box.</p>
            </div>
        );
    }

}
