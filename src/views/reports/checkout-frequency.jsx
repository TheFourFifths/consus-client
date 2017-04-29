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

        function sortByFrequency(a,b){
            return a.frequency > b.frequency;
        }

        return (
            <div key={this.state.models.length}>
                {this.state.models.sort(sortByFrequency).map(model => {
                    return(
                         <div key={model.address + model.frequency}>
                            <ReportModelWithFrequency model={ModelStore.getModelByAddress(model.address)}/>
                         </div>
                    );
                })}
            </div>
        );
    }
}
