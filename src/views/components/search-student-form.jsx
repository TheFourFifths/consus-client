import React from 'react';
import Router from 'react-router';
import { searchStudent } from '../../lib/api-client';

export default class SearchStudentForm extends React.Component {

    changeId(e) {
        searchStudent(e.target.value);
        this.history.pushState(null, 'checkout');
    }

    render() {
        return (
            <div className='search-student-form'>
                <h1>Enter Student ID</h1>
                <input type='text' onChange={this.changeId.bind(this)} placeholder='Student ID' />
            </div>
        );
    }

}
