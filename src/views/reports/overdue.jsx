import React from 'react';
import ListenerComponent from '../../lib/listener-component.jsx';
import ItemStore from '../../store/item-store';
import OverdueItemReportPageController from '../../controllers/reports/overdue';
import OverdueReportItem from '../components/overdue-report-item.jsx';

export default class OverdueItemReportPage extends ListenerComponent {

    componentWillMount(){
        OverdueItemReportPageController.getOverdueItems();
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
        if(this.state.items.length === 0) return <span>No Overdue Items</span>;
        return (
            <div key={this.state.items.length}>
                {this.state.items.map(item => {
                    return(
                         <div key={item.address}>
                            <OverdueReportItem item = {item} />
                         </div>
                     );
                })}
            </div>
        );
    }
}
