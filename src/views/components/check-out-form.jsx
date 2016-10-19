import React from 'react';
import { checkOutItems } from '../../lib/api-client';

export default class CheckOutForm extends React.Component {

    constructor() {
        super();
        this.state = {
            // Store added items in an array here?
            // items: []
            // studentId: 0 how do I get this?
        }
    }

    additem(e) {
        // Display the Item

        // Add the item to the current state
        state[items].push(e.target.value)
        this.setState({
            items: state[items];
        });
    }

    submit(e) {
        e.preventDefault();
        checkOutItems(//Student and item id's here);
    }

    render() {
        return (
            <div className='create-model-form'>
                <h1>Check out an item</h1>
                <form onSubmit={this.submit.bind(this)}>
                    <input type='text' placeholder='Item ID' />
                    <input type='button' value='Add to Cart' onClick='addItem' />
                    <input type='submit' value='Complete Transaction' />
                </form>
            </div>
        );
    }

}
