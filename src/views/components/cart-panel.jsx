import React from 'react';
import { readAddress } from 'consus-core/identifiers';
import { searchItemForCheckout } from '../../lib/api-client';
import { assert } from 'chai';

export default class CartPanel extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            address: ''
        };
    }

    changeAddress(e) {
        try {
            let result = readAddress(e.target.value);
            assert.strictEqual(result.type, 'item');
            searchItemForCheckout(e.target.value);
            this.setState({
                address: ''
            });
        } catch(f) {
            this.setState({
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

    render() {
        return (
            <div className='cart'>
                <h3>Cart</h3>
                <input type='text' onChange={this.changeAddress.bind(this)} value={this.state.address} placeholder='Equipment ID' />
                {this.renderEquipment()}
                <input type='button' onClick={this.props.submit} value='Complete Checkout' />
            </div>
        );
    }

}
