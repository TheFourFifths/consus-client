import { searchStudent } from '../../lib/api-client';
import { Dispatcher } from 'consus-core/flux';
import { hashHistory } from 'react-router';
import CartStore from '../../store/cart-store';
import StudentController from '../pages/student';
import StudentStore from '../../store/student-store';
export default class OmnibarController {
    static getStudent(id) {
        if (typeof id === 'string') {
            id = parseInt(id);
        }
        let currentStudentId;
        if(StudentStore.getStudent() !== null){
            currentStudentId = StudentStore.getStudent().id;
        }
        return searchStudent(id).then(student => {
            if(CartStore.getItems().length !== 0){
                return StudentController.checkout(currentStudentId, CartStore.getItems().map(item => item.address)).then(() => {
                    if(CartStore.getItems().length === 0) {
                        Dispatcher.handleAction("STUDENT_FOUND", student);
                        hashHistory.push('/student');
                    }
                });
            }else{
                Dispatcher.handleAction("STUDENT_FOUND", student);
                hashHistory.push('/student');
            }
            Dispatcher.handleAction("STUDENT_FOUND", student);
        }).catch(() => {
            Dispatcher.handleAction("ERROR", {
                error: "An invalid student ID was scanned. The student could not be found."
            });
        });
    }

    static throwInvalidCharacterError() {
        Dispatcher.handleAction("ERROR", {
            error: "Please only enter Alphanumeric Characters."
        });
    }
}
