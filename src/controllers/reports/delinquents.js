import { getAllStudents } from '../../lib/api-client';
import { Dispatcher } from 'consus-core/flux';

export default class DelinquentReportController {
    static getStudents() {
        return getAllStudents().then(students => {
            Dispatcher.handleAction("STUDENTS_FOUND", students);
        });
    }
}
