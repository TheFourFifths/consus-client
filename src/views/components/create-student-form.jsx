import React from 'react';
import ListenerComponent from '../../lib/listener-component.jsx';
import StudentController from '../../controllers/pages/student';
import StudentStore from '../../store/student-store';

export default class CreateStudentForm extends ListenerComponent {

    getState() {
        return {
            name: '',
            major: '',
            id: StudentStore.getAssociationData().id,
            email: ''
        };
    }

    getStores() {
        return [
            StudentStore
        ];
    }

    changeName(e) {
        this.setState({
            name: e.target.value
        });
    }

    changeMajor(e) {
        this.setState({
            major: e.target.value
        });
    }

    changeId(e) {
        this.setState({
            id: e.target.value
        });
    }

    changeEmail(e) {
        this.setState({
            email: e.target.value
        });
    }

    submit(e) {
        e.preventDefault();
        StudentController.newStudent(
            this.state.id,
            StudentStore.getAssociationData().rfid,
            this.state.major,
            this.state.email,
            this.state.name
        );
    }

    render() {
        return (
            <div className='create-student-form'>
                <h1>New Student</h1>
                <form onSubmit={this.submit.bind(this)}>
                    <strong>Full Name</strong><br/>
                    <input type='text' onChange={this.changeName.bind(this)} placeholder='Name' required/><br/>
                    <strong>Major</strong><br/>
                    <input type='text'  onChange={this.changeMajor.bind(this)} placeholder='Major' required/><br/>
                    <strong>Email</strong><br/>
                    <input type='text'  onChange={this.changeEmail.bind(this)} placeholder='Email' required/><br/>
                    <strong>ID #</strong><br/>
                    <input type='number'  onChange={this.changeId.bind(this)} value={this.state.id} required/><br/>
                    <input className='cool-button' type='submit' value='Create Student' />
                </form>
            </div>
        );
    }

}
