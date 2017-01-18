import React from 'react';
import { Link } from 'react-router';
import ModelStore from '../../store/model-store';
import OmnibarController from '../../controllers/components/omnibar';

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

    goToStudentPage() {
        OmnibarController.getStudent(this.state.item.student.id);
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
                <div className="modelItemArea  displayBlock">
                    <div className="modelArea subBlock">
                        <h3><Link to={`/model/${this.state.item.modelAddress}`}>{this.state.model.name}</Link></h3><p>({this.state.model.address})</p>
                    </div>
                    <div className="itemArea subBlock">
                        <h3>Item Address:</h3><p><Link to={`/item/${this.state.item.address}`}>{this.state.item.address}</Link></p>
                    </div>
                </div>
                <div className="infoArea  displayBlock">
                    <div className="descriptionArea subBlock">
                        <h3>Chcked Out To:</h3>
                        <p><span className='fakeLink' onClick={this.goToStudentPage.bind(this)}>{this.state.item.student.name} </span>({this.state.item.student.id})</p><br/>
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
