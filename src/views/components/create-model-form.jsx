import React from 'react';
import { createModel } from '../../lib/api-client';
import { getAllModels } from '../../lib/api-client'
export default class CreateModelForm extends React.Component {

    constructor() {
        super();
        this.state = {
            name: '',
            description: '',
            manufacturer: '',
            vendor: '',
            location: '',
            isFaulty: false,
            faultDescription: '',
            price: 0.0,
            count: 0
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
        createModel(
            this.state.name,
            this.state.description,
            this.state.manufacturer,
            this.state.vendor,
            this.state.location,
            this.state.isFaulty,
            this.state.faultDescription,
            this.state.price,
            this.state.count
        );
    }
    allModels(e) {
        getAllModels();
    }
    render() {
        return (
            <div className='create-model-form'>
                <h1>Create a Model</h1>
                <button onClick={this.allModels.bind(this)}>View all models</button>
                <form onSubmit={this.submit.bind(this)}>
                    <input type='text' value={this.state.name} onChange={this.changeName.bind(this)} placeholder='Name' />
                    <input type='text' value={this.state.description} onChange={this.changeDescription.bind(this)} placeholder='Description' />
                    <input type='text' value={this.state.manufacturer} onChange={this.changeManufacturer.bind(this)} placeholder='Manufacturer' />
                    <input type='text' value={this.state.vendor} onChange={this.changeVendor.bind(this)} placeholder='Vendor' />
                    <input type='text' value={this.state.location} onChange={this.changeLocation.bind(this)} placeholder='Location' />
                    <input type='text' value={this.state.price} onChange={this.changePrice.bind(this)} placeholder='Price' />
                    <input type='text' value={this.state.count} onChange={this.changeCount.bind(this)} placeholder='Count' />
                    <input type='submit' value='Create Model' />
                </form>
            </div>
        );
    }

}
