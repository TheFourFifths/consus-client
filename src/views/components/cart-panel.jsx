import React from 'react';
import { readAddress } from 'consus-core/identifiers';
import { searchItemForCheckout } from '../../lib/api-client';
import { assert } from 'chai';

export default class StudentPanel extends React.Component {

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
        if(this.props.items.length === 0) {
            return <i>Cart is empty.</i>;
        }
        return (
            <ul>
                {this.props.items.map((item, i) => {
                    return <li key={i}>item.address</li>;
                })}
            </ul>
        );
    }

    render() {
        return (
            <div className='cart'>
                <h3>Cart</h3>
                <input type='text' onChange={this.changeAddress.bind(this)} placeholder='Equipment ID' />
                {this.renderEquipment()}
                <input type='button' onClick={this.props.submit} value='Complete Checkout' />
            </div>
        );
    }

}
