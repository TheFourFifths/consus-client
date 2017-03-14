import React from 'react';
import ListenerComponent from '../../lib/listener-component.jsx';
import StudentStore from '../../store/student-store';
import Student from '../components/student.jsx';
import StudentPageController from '../../controllers/pages/students';

export default class Models extends ListenerComponent {

    componentWillMount(){
        StudentPageController.getStudents();
    }

    getStores() {
        return [
            StudentStore
        ];
    }

    getState() {
        return {
            students: StudentStore.getAllStudents()
        };
    }

    render() {
        return (
            <div id="students">
                <h1>All Students</h1>
                {Object.keys(this.state.students).map((studentId) => {
                    return (
                        <div key={studentId}>
                            <Student studentId={studentId}  />
                        </div>
                    );
                })}
            </div>
        );
    }

}
