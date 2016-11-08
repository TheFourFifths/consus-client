import React from 'react';
import { readAddress } from 'consus-core/identifiers';
import { searchItemForCheckout } from '../../lib/api-client';
import { searchItem } from '../../lib/api-client';
import { checkInItem } from '../../lib/api-client';
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
        try {
            let result = readAddress(e.target.value);
            assert.strictEqual(result.type, 'item');
            let student = this.props.student;
            if( student.itemAddresses.indexOf(e.target.value) ===  -1) {
                searchItemForCheckout(e.target.value);
                this.setState({
                    active: false,
                    address: ''
                });
            } else {
                checkInItem(student.id, e.target.value);
                this.setState({
                    active: true,
                    address: ''
                });
            }
        } catch(f) {
            this.setState({
                active: false,
                address: e.target.value
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
            address: ''
        });
    }

    render() {
        return (
            <div className='cart'>
                <Modal active={this.state.active} onClose={this.closeModal.bind(this)} >You successfully Checked in an Item.<br/></Modal>
                <h3>Cart</h3>
                <input type='text' onChange={this.changeAddress.bind(this)} value={this.state.address} placeholder='Equipment ID' autoFocus/>
                {this.renderEquipment()}
                <input type='button' onClick={this.props.submit} value='Complete Checkout' />
            </div>
        );
    }

}
