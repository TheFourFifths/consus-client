import React from 'react';
import ModelFormController from '../../controllers/components/create-model-form';
import ModelController from '../../controllers/components/model';
import ModelStore  from '../../store/model-store';
import ConfirmModal from './confirm-modal.jsx';
import OmnibarController from '../../controllers/components/omnibar';

export default class EditModelForm extends React.Component {

    constructor(props) {
        super(props);
        if (props.model === undefined)
            this.state = {model: null};
        else
            this.state = {
                model: props.model,
                name: props.model.name,
                description: props.model.description,
                manufacturer: props.model.manufacturer,
                vendor: props.model.vendor,
                location: props.model.location,
                price: props.model.price,
                allowCheckout: props.model.allowCheckout,
                count: props.model.count,
                changeStock: false,
                inStock: props.model.inStock,
                checked: false,
                popConfirmModal: false
            };
    }
    componentDidMount(){
        if(this.state.model === null) {
            ModelController.getModel(this.props.params.address).then(() => {
                let model = ModelStore.getModel();
                this.setState({
                    model: model,
                    name: model.name,
                    description: model.description,
                    manufacturer: model.manufacturer,
                    vendor: model.vendor,
                    location: model.location,
                    price: model.price,
                    allowCheckout: model.allowCheckout,
                    count: model.count,
                    changeStock: false,
                    inStock: model.inStock,
                    checked: false
                });
            });
        }
        OmnibarController.setWarnBeforeExiting(true);
    }

    componentWillUnmount(){
        OmnibarController.setWarnBeforeExiting(false);
    }

    changeName(e) {
        this.setState({
            name: e.target.value
        });
    }
    changeDescription(e) {
        this.setState({
            description: e.target.value
        });
    }

    changeManufacturer(e) {
        this.setState({
            manufacturer: e.target.value
        });
    }

    changeVendor(e) {
        this.setState({
            vendor: e.target.value
        });
    }

    changeLocation(e) {
        this.setState({
            location: e.target.value
        });
    }

    changePrice(e) {
        this.setState({
            price: e.target.value
        });
    }
    changeCount(e){
        this.setState({
            count: e.target.value
        });
    }
    changeStock(e){
        this.setState({
            changeStock: !this.state.checked,
            checked: !this.state.checked
        });
    }
    changeInStock(e){
        this.setState({
            inStock: e.target.value
        });
    }
    submit(e) {
        e.preventDefault();
        ModelFormController.updateModel(
            this.state.model.address,
            this.state.name,
            this.state.description,
            this.state.manufacturer,
            this.state.vendor,
            this.state.location,
            this.state.allowCheckout,
            this.state.price,
            this.state.count,
            this.state.changeStock,
            this.state.inStock
        );
    }

    allModels() {
        this.setState({
            popConfirmModal: true
        });
    }

    handleConfirmModal(bool){
        if(bool){
            ModelFormController.getModels();
        }else{
            this.setState({popConfirmModal: false});
        }
      }

    render() {
        if (this.state.model === null)
            return <div>Loading form...</div>;
        return (
            <div className='create-model-form'>
                <ConfirmModal
                    message="Are you sure you wish to leave the page? Unsaved changes will be lost."
                    active = {this.state.popConfirmModal}
                    onSelect = {bool => this.handleConfirmModal(bool)}
                />
                <h1>Update model: {this.state.model.name}</h1>
                <button onClick={this.allModels.bind(this)}>View all models</button>
                <form onSubmit={this.submit.bind(this)}>
                    Name:<br/>
                    <input type='text' value={this.state.name} onChange={this.changeName.bind(this)} placeholder='Name' required/><br/>
                    Description:<br/>
                    <textarea rows="4" cols="50"  value={this.state.description} onChange={this.changeDescription.bind(this)} placeholder='Description' required/><br/>
                    Manufacturer:<br/>
                    <input type='text' value={this.state.manufacturer} onChange={this.changeManufacturer.bind(this)} placeholder='Manufacturer' /><br/>
                    Vendor:<br/>
                    <input type='text' value={this.state.vendor} onChange={this.changeVendor.bind(this)} placeholder='Vendor' /><br/>
                    Storage location:<br/>
                    <input type='text' value={this.state.location} onChange={this.changeLocation.bind(this)} placeholder='Location' /><br/>
                    Price per unit:<br/>
                    <input type='number' value={this.state.price} onChange={this.changePrice.bind(this)} placeholder='Price' /><br/>
                    {this.state.allowCheckout && <span>Total:<br/><input type='number' value={this.state.count} onChange={this.changeCount.bind(this)}/></span>}<br/>
                    {this.state.allowCheckout && <span>Change the number in Stock? If this is left unchecked, the amount in stock will automatically change by the same amount as the total.</span>}
                    {this.state.allowCheckout && <span><input type='checkbox' value={this.state.changeStock} onChange={this.changeStock.bind(this)} checked={this.state.checked} /></span>}<br/>
                    {this.state.allowCheckout && this.state.changeStock && <span>In stock:<br/><input type='number' value={this.state.inStock} onChange={this.changeInStock.bind(this)}/></span>}<br/><br/>
                    <input type='submit' value='Update Model' />
                </form>
            </div>
        );
    }

}
