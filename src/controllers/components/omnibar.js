import { searchStudent } from '../../lib/api-client';
import { readAddress } from 'consus-core/identifiers';
import { Dispatcher } from 'consus-core/flux';
import { hashHistory } from 'react-router';
import CartStore from '../../store/cart-store';
import StudentController from '../pages/student';
import StudentStore from '../../store/student-store';

let warnBeforeExiting = false;

export default class OmnibarController {

    static setWarnBeforeExiting(bool) {
        warnBeforeExiting = bool;
    }

    static getWarning() {
        return warnBeforeExiting;
    }

    static leavePage(route) {
        hashHistory.push(route);
    }

    static getStudent(id) {
        if (typeof id === 'string') {
            id = parseInt(id);
        }

        if (CartStore.getContents().length !== 0) {
            let currentStudentId;
            if (StudentStore.getStudent() !== null) {
                currentStudentId = StudentStore.getStudent().id;
            }
            return StudentController.checkout(currentStudentId, CartStore.getContents()).then(() => {
                if (CartStore.getContents().length === 0) {
                    return (searchStudent(id));
                }
            }).then(student => {
                if (CartStore.getContents().length === 0) {
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

    static displayItem(itemAddress) {
        try {
            if(readAddress(itemAddress).type === 'item') {
                hashHistory.push('/item/' + itemAddress);
            } else {
                Dispatcher.handleAction("ERROR", {
                    error: "Expected an item address but received a model address"
                });
            }
        } catch (f) {
            Dispatcher.handleAction("ERROR", {
                error: "The provided item address is somehow invalid."
            });
        }
    }

    static throwInvalidCharacterError() {
        Dispatcher.handleAction("ERROR", {
            error: "Please only enter Alphanumeric Characters."
        });
    }

    static emptyCart() {
        if (CartStore.getContents().length !== 0) {
            return StudentController.checkout(StudentStore.getStudent().id, CartStore.getContents());
        }
    }
}
