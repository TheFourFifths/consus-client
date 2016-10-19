import React from 'react';
import Router from 'react-router';
import { searchStudent } from '../../lib/api-client';

export default class SearchStudentForm extends React.Component {

    changeId(e) {
        searchStudent(e.target.value);
        // Need to either redirect to or render the check-out-form
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
