import React from 'react';
import ListenerComponent from '../../lib/listener-component.jsx';
import ItemStore from '../../store/item-store';
import CheckoutFrequencyReportPageController from '../../controllers/reports/checkout-frequency';
import ModelStore from '../../store/model-store';
import ReportModelWithFrequency from '../components/report-model-with-frequency.jsx';

export default class CheckoutFrequencyReportPage extends ListenerComponent {
    constructor(props){
        super(props);
        this.state = {
            loading: true,
            sortBy: "Name"
        };
    }

    componentWillMount(){
        CheckoutFrequencyReportPageController.getAllItems().then(() => this.setState({loading:false}));
    }

    changeSort(e){
        this.setState({sortBy: e.target.id});
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

    getSortFunction(){
        switch(this.state.sortBy){
            case "Frequency":
                return function (a, b){return a.frequency < b.frequency;}
            case "Name":
                return function (a, b){return a.name.localeCompare(b.name);}
            case "LastCheckout":
                return function (a, b){return a.lastCheckedOut < b.lastCheckedOut;}
        }
    }

    render() {
        if(this.state.loading) return <span>Loading Report...</span>;

        let sorter = this.getSortFunction();

        return (
            <div>
                <h1>Checkout Frequency</h1>
                <table className="checkout-frequency-report-table" key={this.state.models.length}>
                    <thead>
                        <tr>
                            <th id="Name" onClick={this.changeSort.bind(this)}>Model Name (Address)</th>
                            <th id="Frequency" onClick={this.changeSort.bind(this)}>Times Checked Out</th>
                            <th id="LastCheckout" onClick={this.changeSort.bind(this)}>Last Checkout Date</th>
                        </tr>
                    </thead>
                    <tbody>
                    {this.state.models.sort(sorter).map(model => {
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
