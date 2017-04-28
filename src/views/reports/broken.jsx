import React from 'react';
import ListenerComponent from '../../lib/listener-component.jsx';
import ItemStore from '../../store/item-store';
import BrokenItemsReportController from '../../controllers/reports/broken';
import ReportItem from '../components/report-faulty-item.jsx';

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
            <table className="broken-item-report-table" key={this.state.items.length}>
                <tbody>
                {this.state.items.map(item => {
                    return(
                        <ReportItem key={item.address} item = {item} />
                    );
                })}
                </tbody>
            </table>
        );
    }

}
