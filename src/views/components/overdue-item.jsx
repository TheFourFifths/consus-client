import React from 'react';
import ModelStore from '../../store/model-store';
import OmnibarController from '../../controllers/components/omnibar';
import ModelPageController from '../../controllers/pages/model';

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

    goToItemPage() {
        OmnibarController.displayItem(this.state.item.address);
    }

    goToModelPage() {
        ModelPageController.getModelAndItems(this.state.item.modelAddress);
    }

    render() {
        let dueOn;
        dueOn = new Date(this.state.item.timestamp * 1000);
        if (this.state.item === null)
            return <i>Item is loading...</i>;
        return (
            <div className='overdueItem'>
                <div className="picArea">
                    <img src={`data:image/jpeg;base64,${this.state.model.photo}`}/>
                </div>
                <div className="modelItemArea displayBlock">
                    <div className="modelArea subBlock">
                        <h3><span className='fakeLink' onClick={this.goToModelPage.bind(this)}>{this.state.item.modelAddress} </span></h3><p>({this.state.model.address})</p>
                    </div>
                    <div className="itemArea subBlock">
                        <h3>Item Address:</h3><p><span className='fakeLink' onClick={this.goToItemPage.bind(this)}>{this.state.item.address} </span></p>
                    </div>
                </div>
                <div className="infoArea displayBlock">
                    <div className="descriptionArea subBlock">
                        <h3>Checked Out To:</h3>
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
