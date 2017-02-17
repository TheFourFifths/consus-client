import { getAllStudents } from '../../lib/api-client';
import { Dispatcher } from 'consus-core/flux';

export default class StudentPageController{
    static getStudents(){
        return getAllStudents().then(students => {
            console.log("FUCK YOU!");
            Dispatcher.handleAction("STUDENTS_FOUND", students);
        });
    }
}
