import React from 'react';
import ModelStore  from '../../store/model-store';
import ModelController from '../../controllers/components/model';
import { hashHistory } from 'react-router';

export default class Model extends React.Component {

    constructor(props){
        super(props);
        if (props.model === undefined)
            this.state = {model: null};
        else
            this.state = {model: props.model};
    }

    componentDidMount(){
        if(this.state.model === null) {
            ModelController.getModel(this.props.params.address).then(() => {
                this.setState({
                    model: ModelStore.getModel()
                });
            });
        }
    }
    editModel(){
        hashHistory.push(`/model/edit/${this.state.model.address}`);
    }

    render() {
        if(this.state.model === null)
            return <i>Data is loading...</i>;
        return (
            <div className='model'>
                <div className="picArea">
                    <img src="../assets/images/placeholder.jpg" />
                </div>
                <div className="titleArea">
                    <h2>{this.state.model.name}</h2>
                    <i className="address">{this.state.model.address}</i>
                </div>
                <div className="infoArea">
                    <div className="descriptionArea">
                        <h3>Description</h3>
                        <p>{this.state.model.description}</p>
                    </div>
                    <div className="faultArea">
                        <h3>Fault</h3>
                        {(this.state.model.isFaulty
                                ? <p>{this.state.model.faultDescription}</p>
                                : <p>Model is not faulty.</p>
                        )}
                    </div>
                    <div className="miscArea">
                        <b>Location:</b> {this.state.model.location}<br/>
                        <b>Price:</b> ${this.state.model.price}<br/>
                        <b>Manufacturer:</b> {this.state.model.manufacturer}<br/>
                        <b>Vendor:</b> {this.state.model.vendor}<br/>
                        <b>Quantity:</b> {this.state.model.count}<br/>
                    </div>
                </div>
                <div className="actionArea">
                    <img src="../assets/images/add.svg" />
                    <img onClick={this.editModel.bind(this)} src="../assets/images/edit.svg" />
                    <img src="../assets/images/delete.svg" />
                </div>
                <div className="clear"> </div>
            </div>
        );
    }

}
