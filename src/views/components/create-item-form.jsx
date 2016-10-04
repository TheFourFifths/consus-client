import React from 'react';
import { createItem } from '../../lib/api-client';

export default class CreateItemForm extends React.Component {

    constructor() {
        super();
        this.state = {
            id: ''
        };
    }

    changeId(e) {
        this.setState({
            id: e.target.value
        });
    }

    submit(e) {
        e.preventDefault();
        createItem(this.state.id);
    }

    render() {
        return (
            <div className='create-item-form'>
                <h1>Create an Item</h1>
                <form onSubmit={this.submit.bind(this)}>
                    <input type='text' value={this.state.id} onChange={this.changeId.bind(this)} placeholder='ID' />
                    <input type='submit' value='Create Item' />
                </form>
            </div>
        );
    }

}
