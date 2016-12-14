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
            itemAddresses: CartStore.getItems().map(item => item.address),
            adminCodeRequired: AuthenticationStore.overrideNeeded()
        };
    }

    acceptAdminModal(code){
        StudentController.acceptAdminModal(code);
        this.checkOut();
    }

    checkOut() {
        if(CartStore.getItems().length > 0)
            StudentController.checkout(this.state.student.id, this.state.itemAddresses);
        else StudentController.throwNoItemsError();
    }

    render() {
        return (
            <div id='student'>
                <StudentPanel student={this.state.student} />
                <CartPanel itemAddresses={this.state.itemAddresses} cancel={StudentController.cancelCheckout} submit={this.checkOut.bind(this)} student={this.state.student} />
                <div className='clear'></div>
                <InputModal
                    message='Please Scan Admin ID or Enter Admin Pin:'
                    active = {this.state.adminCodeRequired}
                    onAccept= {this.acceptAdminModal}
                    onCancel={StudentController.cancelAdminModal}
                    acceptText='Continue Checkout'
                    textHidden={true}
                />
            </div>
        );
    }

}
