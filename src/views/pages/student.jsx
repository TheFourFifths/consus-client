import React from 'react';
import StudentController from '../../controllers/pages/student';
import ListenerComponent from '../../lib/listener-component.jsx';
import StudentStore from '../../store/student-store';
import CartStore from '../../store/cart-store';
import StudentPanel from '../components/student-panel.jsx';
import CartPanel from '../components/cart-panel.jsx';
import AuthenticationStore from '../../store/authentication-store';
import InputModal from '../components/input-modal.jsx';

export default class Student extends ListenerComponent {

    constructor() {
        super();
    }

    getStores() {
        return [
            StudentStore,
            CartStore,
            AuthenticationStore
        ];
    }

    getState() {
        return {
            student: StudentStore.getStudent(),
            adminCodeRequired: AuthenticationStore.overrideNeeded(),
            equipment: CartStore.getContents()
        };
    }

    acceptAdminModal(code) {
        StudentController.acceptAdminModal(code);
        this.checkOut();
    }

    checkOut() {
        if (CartStore.getContents().length > 0) {
            if (CartStore.getIsLongterm()) {
                StudentController.longtermCheckout(this.state.student.id, this.state.equipment,
                    CartStore.getDueDate(), CartStore.getProfessor());
            } else {
                StudentController.checkout(this.state.student.id, this.state.equipment);
            }
            document.querySelector(`#omnibar input[type="text"]`).focus();
        }
        else StudentController.throwNoItemsError();
    }

    checkInModel(studentId, modelAddress, quantity) {
        StudentController.checkInModel(studentId, modelAddress, quantity);
    }

    cancelCheckout() {
        StudentController.cancelCheckout();
    }

    render() {
        return (
            <div id='student'>
                <StudentPanel student={this.state.student} checkInModel={this.checkInModel.bind(this)}/>
                <CartPanel equipment={this.state.equipment} cancel={this.cancelCheckout.bind(this)}
                           submit={this.checkOut.bind(this)} student={this.state.student}/>
                <div className='clear'></div>
                <InputModal
                    message='Please Scan Admin ID or Enter Admin Pin:'
                    active={this.state.adminCodeRequired}
                    onAccept={this.acceptAdminModal.bind(this)}
                    onCancel={StudentController.cancelAdminModal}
                    acceptText='Continue Checkout'
                    textHidden={true}
                />
            </div>
        );
    }

}
