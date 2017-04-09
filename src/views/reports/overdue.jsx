import React from 'react';
import { Dispatcher } from 'consus-core/flux';
import ListenerComponent from '../../lib/listener-component.jsx';
import ItemStore from '../../store/item-store';
import IndexController from '../../controllers/pages/index';
import OverdueItem from '../components/overdue-item.jsx';

let loading = true;

export default class OverdueItemReportPage extends ListenerComponent {

     componentWillMount(){
         IndexController.getOverdueItems().then(() => {
             loading = false;
         });
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
        if(loading) return <span>Loading...</span>;
        if(this.state.items.length === 0) return <span>No Overdue Items</span>;
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
