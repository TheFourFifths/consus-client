import { Dispatcher } from 'consus-core/flux';
import { updateStudent } from '../../lib/api-client';

export default class StudentController{
    static UpdateStudent(student){
        delete student.hasOverdueItem;
        return updateStudent(student).then(student => {
            Dispatcher.handleAction("STUDENT_UPDATED", student);
        });
    }
}
