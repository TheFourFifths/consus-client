import React from 'react';
import { createItem } from '../../lib/api-client';

export default class CreateItemForm extends React.Component {

    constructor() {
        super();
        this.state = {
            modelAddress: ''
        };
    }

    changeModel(e) {
        this.setState({
            modelAddress: e.target.value
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
                    <select value='Select a Model Type' onChange={this.changeId.bind(this)} >
                      
                      <option value="A">Apple</option>
                      <option value="B">Banana</option>
                      <option value="C">Cranberry</option>
                    </select>
                    <input type='submit' value='Create Item' />
                </form>
            </div>
        );
    }

}
