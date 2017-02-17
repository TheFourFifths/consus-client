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
                {this.state.students.sort(this.studentSort).map((student) => {
                    return (
                        <div key={student.id}>
                            <Student student={student}  />
                        </div>
                    );
                })}
            </div>
        );
    }

    studentSort(a, b){
        let splitA, splitB, lastA, lastB;
        splitA = a.name.split();
        lastA = splitA[splitA.length - 1];
        splitB = b.name.split();
        lastB = splitB[splitB.length - 1];
        return lastA.localeCompare(lastB);
    }
}
