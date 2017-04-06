import React from 'react';
import config from 'config';
import ModelFormController from '../../controllers/components/create-model-form';
import ModelController from '../../controllers/components/model';
import ModelStore  from '../../store/model-store';
import ConfirmModal from './confirm-modal.jsx';
import OmnibarController from '../../controllers/components/omnibar';
import ErrorModal from './error-modal.jsx';

const MAX_FILESIZE = bytesToBase64Size(config.get('assets.max_model_photo_size') * 1000); /* bytes */

/**
 * Converts the number of bytes of binary data into its approximate number of
 * bytes when encoded as Base64.
 * See https://en.wikipedia.org/wiki/Base64#MIME
 * @param {number} numBytes - size of binary data, in bytes
 * @returns {number} size of Base64-encoded binary data, in bytes
 */
function bytesToBase64Size(numBytes) {
    return (numBytes * 1.37) + 814;
}

/**
 * Converts the number of bytes of a Base64 string into the equivalent pure binary size.
 * See https://en.wikipedia.org/wiki/Base64#MIME
 * @param {number} numB64Bytes - size of Base64-encoded binary data, in bytes
 * @returns {number} size of binary data, in bytes
 */
function base64SizeToBytes(numB64Bytes) {
    return (numB64Bytes - 814) / 1.37;
}

export default class EditModelForm extends React.Component {

    constructor(props) {
        super(props);
        if (props.model === undefined) {
            this.state = {
                fileOversize: false,
                showFileSizeModal: false,
                model: null,
                hasUnsavedChange: false
            };
        } else {
            this.state = {
                fileOversize: false,
                showFileSizeModal: false,
                hasUnsavedChange: false,

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
                photo: props.model.photo,
                popConfirmModal: false
            };
        }
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
                    photo: model.photo
                });
            });
        }
    }

    componentWillUnmount(){
        OmnibarController.setWarnBeforeExiting(false);
    }

    changeName(e) {
        this.setState({
            hasUnsavedChange: true,
            name: e.target.value
        });
        OmnibarController.setWarnBeforeExiting(true);
    }

    changeDescription(e) {
        this.setState({
            hasUnsavedChange: true,
            description: e.target.value
        });
        OmnibarController.setWarnBeforeExiting(true);
    }

    changeManufacturer(e) {
        this.setState({
            hasUnsavedChange: true,
            manufacturer: e.target.value
        });
        OmnibarController.setWarnBeforeExiting(true);
    }

    changeVendor(e) {
        this.setState({
            hasUnsavedChange: true,
            vendor: e.target.value
        });
        OmnibarController.setWarnBeforeExiting(true);
    }

    changeLocation(e) {
        this.setState({
            hasUnsavedChange: true,
            location: e.target.value
        });
        OmnibarController.setWarnBeforeExiting(true);
    }

    changePrice(e) {
        this.setState({
            hasUnsavedChange: true,
            price: e.target.value
        });
        OmnibarController.setWarnBeforeExiting(true);
    }

    changeCount(e){
        this.setState({
            hasUnsavedChange: true,
            count: e.target.value
        });
        OmnibarController.setWarnBeforeExiting(true);
    }

    changeStock(){
        this.setState({
            hasUnsavedChange: true,
            changeStock: !this.state.changeStock
        });
        OmnibarController.setWarnBeforeExiting(true);
    }

    changeInStock(e){
        this.setState({
            hasUnsavedChange: true,
            inStock: e.target.value
        });
        OmnibarController.setWarnBeforeExiting(true);
    }

    changePhoto(e) {
        this.setState({ hasUnsavedChange: true });
        OmnibarController.setWarnBeforeExiting(true);
        let file = e.target.files[0];
        if (bytesToBase64Size(file.size) > MAX_FILESIZE) {
            this.setState({
                showFileSizeModal: true,
                fileOversize: true
            });
            return;
        } else {
            this.setState({
                showFileSizeModal: false,
                fileOversize: false
            });
        }
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
        reader.readAsDataURL(file);
    }

    closeFileSizeModal() {
        this.setState({ showFileSizeModal: false });
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
            this.state.inStock,
            this.state.photo
        );
    }

    allModels() {
        if (this.state.hasUnsavedChange) {
            this.setState({
                popConfirmModal: true
            });
        } else {
            ModelFormController.getModels();
        }
    }

    handleConfirmModal(bool){
        if (bool) {
            ModelFormController.getModels();
        } else {
            this.setState({popConfirmModal: false});
        }
    }

    render() {
        if (this.state.model === null)
            return <div>Loading form...</div>;
        return (
            <div className='model-form'>
                <ConfirmModal
                    message="Are you sure you wish to leave the page? Unsaved changes will be lost."
                    active = {this.state.popConfirmModal}
                    onSelect = {bool => this.handleConfirmModal(bool)}
                />
                <ErrorModal
                    active={this.state.showFileSizeModal}
                    onClose={this.closeFileSizeModal.bind(this)}
                    message={`The specified file is too large; it must be below ${(base64SizeToBytes(MAX_FILESIZE) / 1000).toFixed(1)} kB.`}
                />
                <h1>Update Model: {this.state.model.name} ({this.state.model.address})</h1>
                <form onSubmit={this.submit.bind(this)}>
                    <label id="name">
                        <strong>Name *</strong><br/>
                        <input type='text' value={this.state.name} onChange={this.changeName.bind(this)} placeholder='Name' required/><br/>
                    </label>
                    <label id="description">
                        <strong>Description *</strong><br/>
                        <textarea rows="4" cols="50"  value={this.state.description} onChange={this.changeDescription.bind(this)} placeholder='Description' required/><br/>
                    </label>
                    <label id="photo">
                        <span className='upload-select'>&#x21E1; Select Photo</span>
                        <input type='file' accept='image/jpeg' onChange={this.changePhoto.bind(this)} capture />
                        <br/>
                        <img id='thumbnail-preview' src={`data:image/jpeg;base64,${this.state.photo}`} />
                        <br/>
                    </label>
                    <label id="manufacturer">
                        Manufacturer<br/>
                        <input type='text' value={this.state.manufacturer} onChange={this.changeManufacturer.bind(this)} placeholder='Manufacturer' /><br/>
                    </label>
                    <label id="vendor">
                        Vendor<br/>
                        <input type='text' value={this.state.vendor} onChange={this.changeVendor.bind(this)} placeholder='Vendor' /><br/>
                    </label>
                    <label id="location">
                        Storage location<br/>
                        <input type='text' value={this.state.location} onChange={this.changeLocation.bind(this)} placeholder='Location' /><br/>
                    </label>
                    <label id="price">
                        Price per unit<br/>
                        $ <input type='number' value={this.state.price} onChange={this.changePrice.bind(this)} placeholder='Price' /><br/>
                    </label>
                    {this.state.allowCheckout && <span>Total:<br/><input type='number' value={this.state.count} onChange={this.changeCount.bind(this)} min='0' step='1' /><br/></span>}
                    {this.state.allowCheckout && <span title='If left unchecked, the stock will change by the same amount as the total.'>Change the Number In Stock Separately?</span>}
                    {this.state.allowCheckout && <span><input type='checkbox' value={this.state.changeStock} onChange={this.changeStock.bind(this)} checked={this.state.changeStock} /><br/></span>}
                    {this.state.allowCheckout && <span className={this.state.changeStock ? '' : 'disabled-text'}>In stock:<br/><input type='number' value={this.state.inStock} onChange={this.changeInStock.bind(this)} min='0' max={this.state.count} step='1' disabled={!this.state.changeStock}/><br/></span>}<br/>
                    <input className='cool-button' type='submit' value='Update Model' disabled={this.state.fileOversize}/>
                </form>
                <br/>
                <button className='neat-secondary-button' onClick={this.allModels.bind(this)}>&#9664; Back</button>
            </div>
        );
    }

}
