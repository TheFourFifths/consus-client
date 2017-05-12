import React from 'react';
import ModelStore  from '../../store/model-store';
import ModelController from '../../controllers/components/model';
import ModelPageController from '../../controllers/pages/model';
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
        if(bool) {
            ModelController.deleteModel(this.state.model.address);
        }
        this.setState({
            needsConfirmationForDelete: false
        });
    }

    confirmAddItem(bool){
        if(bool) {
            ModelController.newModelInstance(this.state.model.address);
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

    goToModel(address) {
        ModelPageController.getModelAndItems(address);
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
        let deleteConfirmationText = `Are you sure you want to delete ${this.state.model.name}?
        WARNING: This will delete all items associated with this model.`;
        let addConfirmationText = this.state.model.allowCheckout ?
                                    `Add another ${this.state.model.name}?`
                                    : `Create a new item for ${this.state.model.name}?`;
        return (
            <div id={this.state.model.address} className='model'>
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
                    <strong><span className='modelName' onClick={this.goToModel.bind(this, this.state.model.address)}>{this.state.model.name}</span></strong><br/>
                    <i className="address">{this.state.model.address}</i>
                    <br/><hr/>
                    <div className="description">{this.renderDescription()}</div>
                </div>
                <div className="infoArea">
                    <b>Location:</b> {this.state.model.location}<br/>
                    <b>Price:</b> ${this.state.model.price}<br/>
                    <b>Manufacturer:</b> {this.state.model.manufacturer}<br/>
                    <b>Vendor:</b> {this.state.model.vendor}<br/>
                    <b>Total:</b> {this.state.model.count}<br/>
                    {(this.state.model.allowCheckout ? <span><b>In Stock:</b> {this.state.model.inStock}<br/></span> : null)}
                </div>
                <div className="actionArea">
                    <img className='btnAddItemToModel icon-button' onClick={this.showAddItemConfirmModal.bind(this)} src="../assets/images/add.svg"/>
                    <img className='icon-button' onClick={this.editModel.bind(this)} src="../assets/images/edit.svg"/>
                    <img className='icon-button' onClick={this.showDeleteConfirmModal.bind(this)} src="../assets/images/delete.svg"/>
                    <img className='icon-button' onClick={this.openQr.bind(this)} src='../assets/images/qr.svg' />
                </div>
                <div className="clear"></div>
            </div>
        );
    }
}
