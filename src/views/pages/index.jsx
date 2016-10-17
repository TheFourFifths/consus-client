import React from 'react';
import ItemStore from '../../store/item-store';
import ModelStore from '../../store/model-store';

import ListenerComponent from '../../lib/listener-component.jsx';
import CreateItemForm from '../components/create-item-form.jsx';
import CreateModelForm from '../components/create-model-form.jsx';
import SearchItemForm from '../components/search-item-form.jsx';
import SearchModelForm from '../components/search-model-form.jsx';
import SearchStudentForm from '../components/search-student-form.jsx'
import Item from '../components/item.jsx';
import Model from '../components/model.jsx';
import Student from '../components/student.jsx';

export default class Index extends ListenerComponent {

    constructor() {
        super();
    }

    getStores() {
        return [
            StudentStore
        ];
    }

    getState() {
        return {
            student: StudentStore.getStudent()
        };
    }

    render() {
        return (
            <div id='index'>
                <SearchStudentForm />
                <Student student={this.state.student} />
            </div>
        );
    }

}
