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
    changeIsFaulty(e){
        this.setState({
            isFaulty: e.target.value
        });
    }
    changeFaultDescription(e) {
        this.setState({
            faultDescription: e.target.value
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
            this.state.isFaulty,
            this.state.faultDescription,
            this.state.price,
        );
    }

    allModels() {
        ModelFormController.getModels();
    }

    render() {
        if (this.state.model === null)
            return <div>Loading form...</div>;
        return (
            <div className='create-model-form'>
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
                    Faulty? <input type="checkbox" value={this.state.isFaulty} onChange={this.changeIsFaulty.bind(this)} /><br/>
                    Fault Description:<br/>
                    <textarea rows="4" cols="50"  value={this.state.faultDescription} onChange={this.changeFaultDescription.bind(this)} placeholder='Description' /><br/><br/>
                    <input type='submit' value='Update Model' />
                </form>
            </div>
        );
    }

}
