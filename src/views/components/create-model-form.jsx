import React from 'react';
import ReactDom from 'react-dom';
import ModelFormController from '../../controllers/components/create-model-form';

export default class CreateModelForm extends React.Component {

    constructor() {
        super();
        this.state = {
            name: '',
            description: '',
            manufacturer: '',
            vendor: '',
            location: '',
            allowCheckout: false,
            price: 0.0,
            count: 0,
            checked: false
        }
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

    changeAllowCheckout(e) {
        this.setState({
            allowCheckout: !this.state.checked,
            checked: !this.state.checked
        });
    }

    changePrice(e) {
        this.setState({
            price: e.target.value
        });
    }

    changeCount(e) {
        this.setState({
            count: e.target.value
        });
    }

    submit(e) {
        e.preventDefault();
        let count = (this.state.allowCheckout) ? this.state.count : 0;
        ModelFormController.createModel(
            this.state.name,
            this.state.description,
            this.state.manufacturer,
            this.state.vendor,
            this.state.location,
            this.state.allowCheckout,
            this.state.price,
            count
        );
    }

    allModels() {
        ModelFormController.getModels();
    }

    render() {
        return (
            <div className='create-model-form'>
                <h1>Create a Model</h1>
                <button onClick={this.allModels.bind(this)}>View all models</button>
                <form onSubmit={this.submit.bind(this)}>
                    Name:<br/>
                    <input type='text' value={this.state.name} onChange={this.changeName.bind(this)} placeholder='Name' required/><br/>
                    Description:<br/>
                    <textarea rows="4" cols="50" value={this.state.description} onChange={this.changeDescription.bind(this)} placeholder='Description' required> </textarea><br/>
                    Manufacturer:<br/>
                    <input type='text' value={this.state.manufacturer} onChange={this.changeManufacturer.bind(this)} placeholder='Manufacturer' /><br/>
                    Vendor:<br/>
                    <input type='text' value={this.state.vendor} onChange={this.changeVendor.bind(this)} placeholder='Vendor' /><br/>
                    Storage location:<br/>
                    <input type='text' value={this.state.location} onChange={this.changeLocation.bind(this)} placeholder='Location' /><br/>
                    Price per unit:<br/>
                    <input type='number' value={this.state.price} onChange={this.changePrice.bind(this)} placeholder='Price' /><br/>
                    Can it be checked out?:
                    <input type='checkbox' value={this.state.allowCheckout} onChange={this.changeAllowCheckout.bind(this)} checked={this.state.checked} /><br/>
                    {this.state.checked && <span>Amount in stock:<br/><input type='number' value={this.state.count} onChange={this.changeCount.bind(this)} required/></span>}<br/><br/>
                    <input type='submit' value='Create Model' />
                </form>
            </div>
        );
    }

}
