import React from 'react';
import ListenerComponent from '../../lib/listener-component.jsx';
import StudentController from '../../controllers/pages/student'
export default class CreateStudentForm extends ListenerComponent {


    constructor() {
        super();
        this.state = {
            name: '',
            major: '',
            id: 0,
            rfid: '',
            email: ''
        }
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
    changeRfid(e) {
        this.setState({
            rfid: e.target.value
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
            this.state.rfid,
            this.state.major,
            this.state.email,
            this.state.name
        );
    }

    render() {
        return (
            <div className='create-student-form'>
                <h1>Create a new Student Profile</h1>
                <form onSubmit={this.submit.bind(this)}>
                    Student's Full name:<br/>
                    <input type='text' onChange={this.changeName.bind(this)} placeholder='Name' required/><br/>
                    Student's ID #:<br/>
                    <input type='number'  onChange={this.changeId.bind(this)} placeholder='ID Number' required/><br/>
                    Student's Major:<br/>
                    <input type='text'  onChange={this.changeMajor.bind(this)} placeholder='Major' required/><br/>
                    Student's email:<br/>
                    <input type='text'  onChange={this.changeEmail.bind(this)} placeholder='Email' required/><br/>
                    Student's Rfid(Click box then scan using rfid scanner):<br/>
                    <input type='text'  onChange={this.changeRfid.bind(this)} placeholder='Rfid' required/><br/>
                    <input type='submit' value='Create Student' />
                </form>
            </div>
        );
    }

}
