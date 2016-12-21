import React from 'react';
import { readAddress } from 'consus-core/identifiers';
import CartController from '../../controllers/components/cart-panel';
import Modal from './modal.jsx';
import { assert } from 'chai';

export default class CartPanel extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            address: '',
            active: false
        };
    }

    changeAddress(e) {
        let regex = new RegExp("^[a-zA-Z0-9]*$");
        if(regex.test(e.target.value)) {
            try {
                let result = readAddress(e.target.value);
                let student = this.props.student;
                if(result.type == 'item') {
                    if (student.items.some(item => item.address === e.target.value)) {
                        CartController.checkInItem(student.id, e.target.value);
                    } else {
                        CartController.getItem(e.target.value);
                    }
                } else if(result.type == 'model') {
                    CartController.getModel(e.target.value);
                    // A model has been received.
                }
                this.setState({
                    address: ''
                });
            } catch (f) {
                this.setState({
                    active: false,
                    address: e.target.value
                });
            }
        }else{
            CartController.throwError("Please only enter Alphanumeric Characters.");
        }
    }

    renderEquipment() {
        if(this.props.equipmentAddresses.length === 0) {
            return <div><br/><i>Cart is empty.</i><br/><br/></div>;
        }
        return (
            <ul>
                {this.props.equipmentAddresses.map((address, i) => {
                    return <li key={i}>{address}</li>;
                })}
            </ul>
        );
    }

    closeModal() {
        this.setState({
            active: false,
            address: this.state.address
        });
    }

    render() {
        return (
            <div className='cart'>
                <Modal active={this.state.active} onClose={this.closeModal.bind(this)} >You successfully checked in an Item.<br/></Modal>
                <h3>Cart</h3>
                <input type='text' maxLength="30" onChange={this.changeAddress.bind(this)} value={this.state.address} placeholder='Equipment ID' autoFocus/>
                {this.renderEquipment()}
                <input type='button' onClick={this.props.submit} value='Complete Checkout' />
                <input type='button' onClick={this.props.cancel} value='Cancel' />
            </div>
        );
    }

}
