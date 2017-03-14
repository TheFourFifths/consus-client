import {searchStudent} from '../../lib/api-client';
import {Dispatcher} from 'consus-core/flux';
import {hashHistory} from 'react-router';
import CartStore from '../../store/cart-store';
import StudentController from '../pages/student';
export default class OmnibarController {

    static getStudent(id) {
        if (typeof id === 'string') {
            id = parseInt(id);
        }
        if (CartStore.getItems().length !== 0) {
            return StudentController.checkout(id, CartStore.getItems().map(item => item.address)).then(() => {
                if (CartStore.getItems().length === 0) {
                    return (searchStudent(id));
                }
            }).then(student => {
                if (CartStore.getItems().length === 0) {
                    Dispatcher.handleAction("STUDENT_FOUND", student);
                    hashHistory.push('/student');
                }
            });
        } else {
            return searchStudent(id).then(student => {
                Dispatcher.handleAction("STUDENT_FOUND", student);
                hashHistory.push('/student');
            }).catch(() => {
                Dispatcher.handleAction("ERROR", {
                    error: "An invalid student ID was scanned. The student could not be found."
                });
            });
        }
    }

    static throwInvalidCharacterError() {
        Dispatcher.handleAction("ERROR", {
            error: "Please only enter Alphanumeric Characters."
        });
    }
}
