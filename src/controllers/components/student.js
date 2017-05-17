import { Dispatcher } from 'consus-core/flux';
import { updateStudent as apiUpdateStudent } from '../../lib/api-client';

export default class StudentController {

    static updateStudent(student) {
        delete student.hasOverdueItem;
        return apiUpdateStudent(student).then(student => {
            Dispatcher.handleAction("STUDENT_UPDATED", student);
        });
    }

}
