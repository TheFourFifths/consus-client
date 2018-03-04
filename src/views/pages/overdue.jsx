import React from 'react';
import ListenerComponent from '../../lib/listener-component.jsx';
import OverdueItem from '../components/overdue-item.jsx';
import OverdueItemsController from '../../controllers/pages/overdue';
import ItemStore from '../../store/item-store';

export default class OverdueItems extends ListenerComponent {
    componentWillMount(){
        OverdueItemsController.getOverdueItems();
    }

    getStores(){
        return [
            ItemStore
        ];
    }

    getState() {
        return {
            overdueItems: ItemStore.getOverdueItems()
        };
    }

    render() {
        return <div>
            <h1>Overdue Items</h1>
            {this.state.overdueItems.map( (item, key) => {
                return <div key={key}>
                    <OverdueItem item={item} />
                </div>;
            })}
        </div>;
    }
}
