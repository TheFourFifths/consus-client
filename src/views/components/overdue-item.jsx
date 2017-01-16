import React from 'react';
import { Link } from 'react-router';
import ModelStore from '../../store/model-store';

export default class OverdueItem extends React.Component {

    constructor(props) {
        super(props);
        if (props.item === undefined)
            this.state = {item: null, model: null};
        else{
            this.state = {
                item: props.item,
                model: ModelStore.getModelByAddress(props.item.modelAddress)
            };
        }
    }

    render() {
        let dueOn;
        dueOn = new Date(this.state.item.timestamp * 1000);
        if (this.state.item === null)
            return <i>Item is loading...</i>;
        return (
            <div className='overdueItem'>
                <div className="picArea">
                    <img src="../assets/images/placeholder.jpg"/>
                </div>
                <div className="modelItemArea">
                    <div className="modelArea">
                        <h3>{this.state.model.name}</h3><p>{this.state.model.address}</p>
                    </div>
                    <div className="itemArea">
                        <h3>Address:</h3><p>{this.state.item.address}</p>
                    </div>
                </div>
                <div className="infoArea">
                    <div className="descriptionArea">
                        <h3>Checked Out To:</h3>
                        <p>{this.state.item.student.name} ({this.state.item.student.id})</p><br/>
                    </div>
                    <div className="dueOn">
                        <h3>Due on:</h3>
                        <p>{dueOn.toDateString()}</p>
                    </div>
                </div>
                <div className="clear"></div>
            </div>
        );
    }

}
