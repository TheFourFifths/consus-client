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
                assert.strictEqual(result.type, 'item');
                let student = this.props.student;
                if (student.items.some(item => item.address === e.target.value)) {
                    CartController.checkIn(student.id, e.target.value);
                } else {
                    CartController.searchItem(e.target.value);
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
            Dispatcher.handleAction('ERROR', {
                error: "Please only enter Alphanumeric Characters."
            });
        }
    }

    renderEquipment() {
        if(this.props.itemAddresses.length === 0) {
            return <div><br/><i>Cart is empty.</i><br/><br/></div>;
        }
        return (
            <ul>
                {this.props.itemAddresses.map((itemAddress, i) => {
                    return <li key={i}>{itemAddress}</li>;
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
