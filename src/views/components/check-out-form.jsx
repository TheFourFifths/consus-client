import React from 'react';
import { checkOutItems } from '../../lib/api-client';

export default class CheckOutForm extends React.Component {

    constructor() {
        super();
        this.state = {
            id: '',
            name: ''
        }
    }

    changeId(e) {
        this.setState({
            id: e.target.value
        });
    }

    changeName(e) {
        this.setState({
            name: e.target.value
        });
    }

    submit(e) {
        e.preventDefault();
        createModel(this.state.id, this.state.name);
    }

    render() {
        return (
            <div className='create-model-form'>
                <h1>Create a Model</h1>
                <form onSubmit={this.submit.bind(this)}>
                    <input type='text' value={this.state.id} onChange={this.changeId.bind(this)} placeholder='Student ID' />
                    <input type='submit' value='Find Student' />
                </form>
            </div>
        );
    }

}
