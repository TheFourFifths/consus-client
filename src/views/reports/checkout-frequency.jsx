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
            sortBy: "Name",
            reversed: false
        };
    }

    componentWillMount(){
        CheckoutFrequencyReportPageController.getAllItems().then(() => this.setState({loading:false}));
    }

    changeSort(e){
        let clicked = e.target.id.length > 0? e.target.id: this.state.sortBy;
        if(clicked === this.state.sortBy) this.setState({reversed: !this.state.reversed});
        else this.setState({sortBy: clicked, reversed: false});
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

    renderModels(){
        let sorter = this.getSortFunction();
        let returned = this.state.models.sort(sorter).map(model => {
            return(
                <ReportModelWithFrequency key={model.address + model.frequency} model={model}/>
            );
        });
        if (this.state.reversed) returned.reverse();
        return returned;
    }

    renderIcon(header){
        if(header !== this.state.sortBy) return <img id={header} height='10' width='10' src="../assets/images/both-arrows.png" />;
        else if(this.state.reversed) return <img id={header} height='10' width='10' src="../assets/images/up-arrow.png" />;
        else return <img id={header} height='10' width='10' src="../assets/images/down-arrow.png" />;
    }

    render() {
        if(this.state.loading) return <span>Loading Report...</span>;

        return (
            <div>
                <h1>Checkout Frequency</h1>
                <table className="checkout-frequency-report-table" key={this.state.models.length}>
                    <thead>
                        <tr>
                            <th className="report-table-header" id="Name" onClick={this.changeSort.bind(this)}>Model Name (Address)<span>{this.renderIcon('Name')}</span></th>
                            <th className="report-table-header" id="Frequency" onClick={this.changeSort.bind(this)}>Times Checked Out<span>{this.renderIcon('Frequency')}</span></th>
                            <th className="report-table-header" id="LastCheckout" onClick={this.changeSort.bind(this)}>Last Checkout Date<span>{this.renderIcon('LastCheckout')}</span></th>
                        </tr>
                    </thead>
                    <tbody>
                    {this.renderModels()}
                    </tbody>
                </table>
            </div>
        );
    }
}
