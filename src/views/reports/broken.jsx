import React from 'react';
import ListenerComponent from '../../lib/listener-component.jsx';
import ItemStore from '../../store/item-store';
import BrokenItemsReportController from '../../controllers/reports/broken';
import Item from '../components/item.jsx';

export default class FaultyItemReportPage extends ListenerComponent {

    componentWillMount(){
        BrokenItemsReportController.getFaultyItems();
    }

    getStores(){
        return [
            ItemStore
        ];
    }

    getState(){
        return {
            items: ItemStore.getFaultyItems()
        };
    }

    render() {
        if(this.state.items.length === 0) return <span>No Faulty Items</span>;
        return (
            <div key={this.state.items.length}>
                {this.state.items.map(item => {
                    return(
                         <div key={item.address + item.faultHistory.length}>
                            <Item noButtons={true} item = {item} />
                         </div>
                     );
                })}
            </div>
        );
    }

}
