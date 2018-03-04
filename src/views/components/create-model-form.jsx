import React from 'react';
import ModelFormController from '../../controllers/components/create-model-form';
import ErrorModal from './error-modal.jsx';
import config from 'config';

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

export default class CreateModelForm extends React.Component {

    constructor() {
        super();
        this.state = {
            fileOversize: false,
            showFileSizeModal: false,
            name: '',
            description: '',
            manufacturer: '',
            vendor: '',
            location: '',
            allowCheckout: false,
            price: 0.0,
            count: 0,
            photo: ''
        };
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

    changeAllowCheckout() {
        this.setState({
            allowCheckout: !this.state.allowCheckout
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

    changePhoto(e) {
        this.setState({ hasUnsavedChange: true });
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
        let count = (this.state.allowCheckout) ? this.state.count : 0;
        ModelFormController.createModel(
            this.state.name,
            this.state.description,
            this.state.manufacturer,
            this.state.vendor,
            this.state.location,
            this.state.allowCheckout,
            this.state.price,
            count,
            this.state.photo
        );
    }

    allModels() {
        ModelFormController.getModels();
    }

    render() {
        return (
            <div className='model-form'>
                <ErrorModal
                    active={this.state.showFileSizeModal}
                    onClose={this.closeFileSizeModal.bind(this)}
                    message={`The specified file is too large.
                            It must be below ${(base64SizeToBytes(MAX_FILESIZE) / 1000).toFixed(1)} kB.`}
                    tag = "WARNING"
                />
                <h1>Create a Model</h1>
                <form onSubmit={this.submit.bind(this)}>
                    <strong>Name *</strong><br/>
                    <input type='text' value={this.state.name} onChange={this.changeName.bind(this)} placeholder='Name' required/><br/>
                    <strong>Description *</strong><br/>
                    <textarea rows="4" cols="50" value={this.state.description} onChange={this.changeDescription.bind(this)} placeholder='Description' required> </textarea><br/>
                    <label id="photo">
                        <span className='upload-select'>&#x21E1; Select Photo</span>
                        <input type='file' accept='image/jpeg' onChange={this.changePhoto.bind(this)} capture />
                        <br/>
                        <img id='thumbnail-preview' src={`data:image/jpeg;base64,${this.state.photo}`} />
                        <br/>
                    </label>
                    Manufacturer<br/>
                    <input type='text' value={this.state.manufacturer} onChange={this.changeManufacturer.bind(this)} placeholder='Manufacturer' /><br/>
                    Vendor<br/>
                    <input type='text' value={this.state.vendor} onChange={this.changeVendor.bind(this)} placeholder='Vendor' /><br/>
                    Storage location<br/>
                    <input type='text' value={this.state.location} onChange={this.changeLocation.bind(this)} placeholder='Location' /><br/>
                    Price per unit<br/>
                    $ <input type='number' value={this.state.price} onChange={this.changePrice.bind(this)} placeholder='Price' /><br/>
                    <div className='radio-buttons'>
                        Is It Serialized or Unserialized?<br/>
                        <input type='radio' name='serialized' value='serialized' checked={!this.state.allowCheckout} onChange={this.changeAllowCheckout.bind(this)} />
                        Serialized<br/>
                        <input type='radio' name='serialized' value='unserialized' checked={this.state.allowCheckout} onChange={this.changeAllowCheckout.bind(this)} />
                        Unserialized<br/>
                    </div>
                    <span className={this.state.allowCheckout ? '' : 'disabled-text'}>
                        Amount In Stock
                        <br/>
                        <input type='number' value={this.state.count} onChange={this.changeCount.bind(this)} disabled={!this.state.allowCheckout} min='0' step='1' required/>
                    </span>
                    <br/>
                    <input className='cool-button' type='submit' value='Create Model' />
                </form>
                <br/>
                <button id='back-btn' className='neat-secondary-button' onClick={this.allModels.bind(this)}>&#9664; Back</button>
            </div>
        );
    }

}
