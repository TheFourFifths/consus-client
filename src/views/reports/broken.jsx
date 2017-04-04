import React from 'react';
import { Dispatcher } from 'consus-core/flux';
import ListenerComponent from '../../lib/listener-component.jsx';
import ItemStore from '../../store/item-store';
import Item from '../components/item.jsx'

export default class OverdueItemReportPage extends ListenerComponent {

     componentWillMount(){
     }

    getStores(){
        return [
            ItemStore
        ];
    }

    getState(){
        return {
            items: ItemStore.getOverdueItems()
        };
    }

    render() {
        if(this.state.items.length === 0) return <span>No Faulty Items</span>;
        return (
            <div key={this.state.items.length}>
                {this.state.items.map(item => {
                    return(
                         <div key={item.address}>
                            <OverdueItem item = {item} />
                         </div>
                     );
                })}
            </div>
        )
    }

}
