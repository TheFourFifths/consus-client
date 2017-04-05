import {
    checkOutContents,
    searchStudent,
    checkInModel,
    checkOutContentsLongterm,
    createRfidToStudentAssosciation,
    createStudent} from '../../lib/api-client';
import { Dispatcher } from 'consus-core/flux';
import AuthStore from '../../store/authentication-store';
import moment from 'moment-timezone';
import StudentStore from '../../store/student-store';
import OmnibarController from '../../controllers/components/omnibar'
export default class StudentController {

    static acceptAdminModal(adminCode) {
        if (adminCode.length > 0) {
            Dispatcher.handleAction("ADMIN_CODE_ENTERED", {adminCode});
        }
    }

    static cancelAdminModal() {
        Dispatcher.handleAction("CLEAR_ADMIN_WINDOW");
    }

    static cancelCheckout() {
        Dispatcher.handleAction('CLEAR_CART_CONTENTS');
    }

    static checkout(id, equipment) {
        return checkOutContents(id, equipment, AuthStore.getAdminCode()).then(() => {
            return searchStudent(StudentStore.getStudent().rfid).then(student => {
                Dispatcher.handleAction('CHECKOUT_SUCCESS');
                Dispatcher.handleAction("STUDENT_FOUND", student);
            });
        }).catch(error => {
            if (error === 'Student has overdue item') {
                Dispatcher.handleAction('OVERRIDE_REQUIRED');
            } else if (error === 'Invalid Admin') {
                Dispatcher.handleAction('CLEAR_ADMIN_CODE');
            } else {
                Dispatcher.handleAction('ERROR', {
                    error
                });
            }
        });
    }

    static checkInModel(id, modelAddress, quantity) {
        return checkInModel(id, modelAddress, quantity).then(data => {
            return searchStudent(StudentStore.getStudent().rfid).then(student => {
                Dispatcher.handleAction('MODEL_CHECKIN_SUCCESS', {
                    modelAddress: data.modelAddress,
                    modelName: data.modelName,
                    quantity: data.quantity
                });
                Dispatcher.handleAction("STUDENT_FOUND", student);
            });
        }).catch(() => {
            Dispatcher.handleAction("ERROR", {
                error: 'Model checkin has failed'
            });
        });
    }

    static longtermCheckout(id, equipment, dueDate, professor) {

        if(this.isValidLongtermData(dueDate, professor)){
            return checkOutContentsLongterm(id, equipment, dueDate, professor, AuthStore.getAdminCode()).then(() => {
                return searchStudent(StudentStore.getStudent().rfid).then(student => {
                    Dispatcher.handleAction('CHECKOUT_SUCCESS');
                    Dispatcher.handleAction("STUDENT_FOUND", student);
                });
            }).catch(error => {
                if (error === 'Student has overdue item') {
                    Dispatcher.handleAction('OVERRIDE_REQUIRED');
                } else if (error === 'Invalid Admin') {
                    Dispatcher.handleAction('CLEAR_ADMIN_CODE');
                } else {
                    Dispatcher.handleAction('ERROR', {
                        error
                    });
                }
            });
        }
    }

    static isValidLongtermData(dueDate, professor) {
        if(dueDate === undefined || dueDate === null){
            Dispatcher.handleAction('ERROR', {
                error: 'Please enter a due date.'
            });
            return false;
        }
        let today = moment();
        let dueDateMoment = moment.tz(dueDate, 'America/Chicago');
        if(!dueDateMoment.isAfter(today)){
            Dispatcher.handleAction('ERROR', {
                error: 'Due date cannot be set to today or past.'
            });
            return false;
        }
        if(professor === undefined || professor === null){
            Dispatcher.handleAction('ERROR', {
                error: 'Please enter a professor name.'
            });
            return false;
        }
        return true;
    }

    static throwNoItemsError() {
        Dispatcher.handleAction('ERROR', {
            error: 'No Items were scanned for checkout.'
        });
    }

    static studentToRfid(studentId, rfid){
        return createRfidToStudentAssosciation(studentId, rfid).then(() => {
            Dispatcher.handleAction('CREATE_TOAST', {
                text: 'The student has been associated successfully!'
            });
            OmnibarController.getStudent(rfid);
        });
    }

    static newStudent(studentId, rfid, major, email, name){
        return createStudent(studentId, rfid, major, email, name).then(() => {
           OmnibarController.leavePage('/');
        });
    }

}
