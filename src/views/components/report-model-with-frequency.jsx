import React from 'react';
import ItemStore from '../../store/item-store';

export default class ReportModelWithFrequency extends React.Component {

    render() {
        if(!this.props.model.allowCheckout){
            let items = ItemStore.getItemsOfModel(this.props.model.address);
            let frequency = items.reduce((acc, cur) => acc + cur.frequency, 0);
            return <p>{this.props.model.name}:{frequency}</p>;
        }else{
            return <p>{this.props.model.name}:{this.props.model.frequency}</p>;
        }
    }

}
