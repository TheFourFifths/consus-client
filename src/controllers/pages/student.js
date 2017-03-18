import { checkOutContents, searchStudent, checkInModel, checkOutContentsLongterm } from '../../lib/api-client';
import { Dispatcher } from 'consus-core/flux';
import AuthStore from '../../store/authentication-store';

export default class StudentController{
    static acceptAdminModal(adminCode){
        if (adminCode.length > 0)
            Dispatcher.handleAction("ADMIN_CODE_ENTERED", {adminCode});
    }

    static cancelAdminModal() {
        Dispatcher.handleAction("CLEAR_ADMIN_WINDOW");
    }

    static cancelCheckout() {
        Dispatcher.handleAction('CLEAR_CART_CONTENTS');
    }

    static checkout(id, equipment) {
        let equipmentAddresses = this.pushEquipment(equipment);
        return checkOutContents(id, equipmentAddresses, AuthStore.getAdminCode()).then(() => {
            return searchStudent(id).then(student => {
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
    static pushEquipment(equipment){
        let equipmentAddresses = [];
        if (equipment) {
            equipment.forEach(e => {
                if(e.quantity){
                    for (let i = 0; i < e.quantity; i++){
                        equipmentAddresses.push(e.address);
                    }
                } else {
                    equipmentAddresses.push(e.address);
                }
            });
        }
        return equipmentAddresses;
    }

    static checkInModel(id, modelAddress, quantity){
        return checkInModel(id, modelAddress, quantity).then(data => {
            return searchStudent(id).then(student => {
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

    static longtermCheckout(id, equipment, dueDate, professor){
        let logger = {
            id,
            equipment,
            dueDate,
            professor
        };
        console.log(logger);

        if(this.isValidLongtermData(dueDate, professor)){
            let equipmentAddresses = this.pushEquipment(equipment);
            return checkOutContentsLongterm(id, equipmentAddresses, dueDate, professor, AuthStore.getAdminCode()).then(() => {
                return searchStudent(id).then(student => {
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
    static isValidLongtermData(dueDate, professor){
        if(dueDate === undefined){
            Dispatcher.handleAction('ERROR', {
                error: 'Please enter a due date.'
            });
            return false;
        }
        if(professor === undefined){
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
}
