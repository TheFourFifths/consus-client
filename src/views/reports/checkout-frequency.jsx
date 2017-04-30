import React from 'react';
import ListenerComponent from '../../lib/listener-component.jsx';
import ItemStore from '../../store/item-store';
import CheckoutFrequencyReportPageController from '../../controllers/reports/checkout-frequency';
import ModelStore from '../../store/model-store';
import ReportModelWithFrequency from '../components/report-model-with-frequency.jsx';

export default class CheckoutFrequencyReportPage extends ListenerComponent {

    componentWillMount(){
        CheckoutFrequencyReportPageController.getAllItems();
    }

    getStores(){
        return [
            ItemStore,
            ModelStore
        ];
    }

    getState(){
        return {
            items: ItemStore.getAllItems(),
            models: ModelStore.getAllModels()
        };
    }


    render() {

        function sortByFrequency(a, b){
            return a.frequency < b.frequency;
        }

        return (
            <div>
                <h1>Checkout Frequency</h1>
                <table className="checkout-frequency-report-table" key={this.state.models.length}>
                    <thead>
                        <tr>
                            <th>Model Name (Address)</th>
                            <th>Times Checked Out</th>
                            <th>Last Checkout Date</th>
                        </tr>
                    </thead>
                    <tbody>
                    {this.state.models.sort(sortByFrequency).map(model => {
                        return(
                            <ReportModelWithFrequency key={model.address + model.frequency} model={model}/>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        );
    }
}
