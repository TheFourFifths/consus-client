import React from 'react';
import ModelStore  from '../../store/model-store';
import ModelController from '../../controllers/components/model';
import PrinterController from '../../controllers/pages/printer';
import { hashHistory } from 'react-router';
import ConfirmModal from '../components/confirm-modal.jsx';

export default class Model extends React.Component {

    constructor(props){
        super(props);
        if (props.model === undefined) {
            this.state = {
                model: null,
                needsConfirmationForDelete: false,
                needsConfirmationForAdd: false
            };
        } else {
            this.state = {
                model: this.props.model,
                needsConfirmationForDelete: false,
                needsConfirmationForAdd: false
            };
        }
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

    showConfirmModal(){
        this.setState({
            needsConfirmationForDelete: true
        });
    }

    showDeleteConfirmModal(){
        this.setState({
            needsConfirmationForDelete: true
        });
    }

    showAddItemConfirmModal(){
        this.setState({
            needsConfirmationForAdd: true
        });
    }

    confirmDelete(bool){
        if(bool === true) {
            ModelController.deleteModel(this.state.model.address);
        }
        this.setState({
            needsConfirmationForDelete: false
        });
    }

    confirmAddItem(bool){
        if(bool === true) {
            ModelController.addItemToModel(this.state.model.address);
        }
        this.setState({
            needsConfirmationForAdd: false
        });
    }

    editModel(){
        hashHistory.push(`/model/edit/${this.state.model.address}`);
    }

    deleteModel() {
        ModelController.deleteModel(this.state.model.address);
    }

    renderDescription() {
        return this.state.model.description.split(/[\r\n]/g).map((line, index) => {
            return <span key={index}>{line}<br/></span>;
        });
    }

    openQr() {
        PrinterController.promptToPrint(this.state.model.address);
    }

    render() {
        if (this.state.model === null)
            return <i>Data is loading...</i>;
        let deleteConfirmationText = `Are you sure you want to delete this model(${this.state.model.name})? WARNING: This will delete all
                items associated with this model`;
        let addConfirmationText = `Create new item for model(${this.state.model.name})?`;
        return (
            <div className='model'>
                <ConfirmModal
                    message={deleteConfirmationText}
                    active={this.state.needsConfirmationForDelete}
                    onSelect={bool => this.confirmDelete(bool)}
                />
                <ConfirmModal
                    message={addConfirmationText}
                    active={this.state.needsConfirmationForAdd}
                    onSelect={bool => this.confirmAddItem(bool)}
                />
                <div className="picArea">
                    <img src={`data:image/jpeg;base64,${this.state.model.photo}`}/>
                </div>
                <div className="titleArea">
                    <h2>{this.state.model.name}</h2>
                    <i className="address">{this.state.model.address}</i>
                </div>
                <div className="infoArea">
                    <div className="descriptionArea">
                        <h3>Description</h3>
                        <p>{this.renderDescription()}</p>
                    </div>
                    <div className="faultArea">
                        {(this.state.model.allowCheckout
                                ? <span><b>Total:</b> {this.state.model.count}<br/><b>In Stock:</b> {this.state.model.inStock}</span>
                                : <i>Model cannot be checked out.</i>
                        )}
                    </div>
                    <div className="miscArea">
                        <b>Location:</b> {this.state.model.location}<br/>
                        <b>Price:</b> ${this.state.model.price}<br/>
                        <b>Manufacturer:</b> {this.state.model.manufacturer}<br/>
                        <b>Vendor:</b> {this.state.model.vendor}<br/>
                        {(this.state.model.allowCheckout ? null : <span><b>Quantity:</b> {this.state.model.count}<br/></span>)}
                    </div>
                </div>
                <div className="actionArea">
                    <img className='btnAddItemToModel' onClick={this.showAddItemConfirmModal.bind(this)} src="../assets/images/add.svg"/>
                    <img onClick={this.editModel.bind(this)} src="../assets/images/edit.svg"/>
                    <img onClick={this.showDeleteConfirmModal.bind(this)} src="../assets/images/delete.svg"/>
                    <img onClick={this.openQr.bind(this)} src='../assets/images/qr.svg' />
                </div>
                <div className="clear"></div>
            </div>
        );
    }
}
