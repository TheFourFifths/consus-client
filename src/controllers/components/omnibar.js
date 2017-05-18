import { searchStudent, searchItem, searchModel } from '../../lib/api-client';
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

    static getStudent(rfid) {
        if (typeof rfid === 'string') {
            rfid = parseInt(rfid);
        }

        if (CartStore.getContents().length !== 0) {
            return this.finishCheckout(rfid);
        } else {
            return searchStudent(rfid).then(student => {
                Dispatcher.handleAction("STUDENT_FOUND", student);
                hashHistory.push('/student');
            });
        }
    }

    static finishCheckout(rfid) {
        let currentStudentId;
        if (StudentStore.getStudent() !== null) {
            currentStudentId = StudentStore.getStudent().id;
        }
        if (CartStore.getIsLongterm()) {
            if (!StudentController.isValidLongtermData(CartStore.getDueDate(), CartStore.getProfessor())) {
                return;
            } else {
                return StudentController.longtermCheckout(StudentStore.getStudent().id, CartStore.getContents(), CartStore.getDueDate(),
                    CartStore.getProfessor()).then(() => {
                        if (CartStore.getContents().length === 0) {
                            return searchStudent(StudentStore.getStudent().rfid);
                        }
                    }).then(student => {
                        if (CartStore.getContents().length === 0) {
                            Dispatcher.handleAction("STUDENT_FOUND", student);
                            hashHistory.push('/student');
                        }
                    });
            }
        }
        return StudentController.checkout(currentStudentId, CartStore.getContents()).then(() => {
            if (CartStore.getContents().length === 0) {
                return (searchStudent(rfid));
            }
        }).then(student => {
            if (CartStore.getContents().length === 0) {
                Dispatcher.handleAction("STUDENT_FOUND", student);
                hashHistory.push('/student');
            }
        });
    }

    static displayEquipment(equipAddress) {
        try {
            let type = readAddress(equipAddress).type;
            if(type === 'item') {
                return searchItem(equipAddress).then(data => {
                    Dispatcher.handleAction("ITEM_FOUND", data);
                    hashHistory.push(`/item/${equipAddress}`);
                });
            } else if (type === 'model') {
                return searchModel(equipAddress).then(data => {
                    Dispatcher.handleAction("ITEM_FOUND", data);
                    hashHistory.push(`/model/${equipAddress}`);
                });
            }
        } catch (f) {
            Dispatcher.handleAction("ERROR", {
                error: "The provided address is invalid."
            });
        }
    }

    static throwQueryInvalidError() {
        Dispatcher.handleAction("WARN", {
            warn: "Invalid Query. Student RFID format should be 'rfid:######'. Model/item addresses are case sensitive."
        });
    }

    static emptyCart() {
        if (CartStore.getContents().length !== 0) {
            if (CartStore.getIsLongterm()) {
                if (!StudentController.isValidLongtermData(CartStore.getDueDate(), CartStore.getProfessor())) {
                    return false;
                }
                StudentController.longtermCheckout(StudentStore.getStudent().id, CartStore.getContents(), CartStore.getDueDate(),
                    CartStore.getProfessor()).then(() => {
                        return true;
                    });
            } else {
                StudentController.checkout(StudentStore.getStudent().id, CartStore.getContents()).then(() => {
                    return true;
                });
            }

        }
        return true;
    }

}
