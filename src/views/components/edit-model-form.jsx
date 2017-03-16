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
                isFaulty: props.model.isFaulty,
                faultDescription: props.model.faultDescription,
                photo: props.model.photo,
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
                    isFaulty: model.isFaulty,
                    faultDescription: model.faultDescription,
                    photo: model.photo
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

    changePhoto(e) {
        let img = document.getElementById('thumbnail-preview');
        let reader = new FileReader();
        reader.onload = ((anImgTag) => {
            return (e) => {
                let b64StartIdx = e.target.result.indexOf('base64,') + 'base64,'.length;
                this.setState({
                    photo: e.target.result.substring(b64StartIdx)
                });
                anImgTag.src = e.target.result;
            };
        })(img);
        reader.readAsDataURL(e.target.files[0]);
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
            this.state.photo
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
                    <label id="name">
                        Name:<br/>
                        <input type='text' value={this.state.name} onChange={this.changeName.bind(this)} placeholder='Name' required/><br/>
                    </label>
                    <label id="description">
                        Description:<br/>
                        <textarea rows="4" cols="50"  value={this.state.description} onChange={this.changeDescription.bind(this)} placeholder='Description' required/><br/>
                    </label>
                    <label id="manufacturer">
                        Manufacturer:<br/>
                        <input type='text' value={this.state.manufacturer} onChange={this.changeManufacturer.bind(this)} placeholder='Manufacturer' /><br/>
                    </label>
                    <label id="vendor">
                        Vendor:<br/>
                        <input type='text' value={this.state.vendor} onChange={this.changeVendor.bind(this)} placeholder='Vendor' /><br/>
                    </label>
                    <label id="location">
                        Storage location:<br/>
                        <input type='text' value={this.state.location} onChange={this.changeLocation.bind(this)} placeholder='Location' /><br/>
                    </label>
                    <label id="price">
                        Price per unit:<br/>
                        <input type='number' value={this.state.price} onChange={this.changePrice.bind(this)} placeholder='Price' /><br/>
                    </label>

                    Faulty? <input type="checkbox" value={this.state.isFaulty} onChange={this.changeIsFaulty.bind(this)} /><br/>

                    Fault Description:<br/>
                    <textarea rows="4" cols="50"  value={this.state.faultDescription} onChange={this.changeFaultDescription.bind(this)} placeholder='Description' /><br/><br/>

                    <label id="photo">
                        Model photo thumbnail:<br/>
                        <input type='file' accept='image/jpeg' onChange={this.changePhoto.bind(this)} capture />
                        <br/>
                        <img id='thumbnail-preview' src={`data:image/jpeg;base64,${this.state.photo}`} />
                        <br/>
                    </label>

                    <input type='submit' value='Update Model' />
                </form>
            </div>
        );
    }

}
