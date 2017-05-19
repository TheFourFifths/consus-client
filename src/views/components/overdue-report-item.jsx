import React from 'react';
import ModelStore from '../../store/model-store';

export default class OverdueReportItem extends React.Component {

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
        return (
            <div className='overdueItem'>
                <div className="picArea">
                    <img src="../assets/images/placeholder.jpg"/>
                </div>
                <div className="modelItemArea  displayBlock">
                    <div className="modelArea subBlock">
                        <h3>{this.state.model.name}</h3><p>({this.state.model.address})</p>
                    </div>
                    <div className="itemArea subBlock">
                        <h3>Item Address:</h3><p>{this.state.item.address}</p>
                    </div>
                </div>
                <div className="infoArea  displayBlock">
                    <div className="descriptionArea subBlock">
                        <h3>Checked Out To:</h3>
                        <p><span className='fakeLink'>{this.state.item.student.name} </span>({this.state.item.student.id})</p><br/>
                    </div>
                    <div className="dueOn subBlock">
                        <h3>Due on:</h3>
                        <p>{dueOn.toDateString()}</p>
                    </div>
                </div>
                <div className="clear"></div>
            </div>
        );
    }

}
