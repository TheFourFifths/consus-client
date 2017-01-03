import React from 'react';
import ListenerComponent from '../../lib/listener-component';
import Item from '../components/item.jsx';
import OverdueItemsController from '../../controllers/pages/overdue';
import { Link } from 'react-router';
import ItemStore from '../../store/item-store';

export default class OverdueItems extends ListenerComponent {
    constructor() {
        super();
    }

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
        }
    }

    render() {
        return <div>
            <h1>Overdue Items</h1>
            <Link to="/">Home</Link>
            {this.state.overdueItems( (item, key) => {
                return <div key={key}>
                    <Item item={item} />
                </div>
            })}
        </div>
    }
}
