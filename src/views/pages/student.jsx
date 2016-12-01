import React from 'react';

import ListenerComponent from '../../lib/listener-component.jsx';
import StudentStore from '../../store/student-store';
import CartStore from '../../store/cart-store';
import StudentPanel from '../components/student-panel.jsx';
import CartPanel from '../components/cart-panel.jsx';
import AuthenticationStore from '../../store/authentication-store';
import InputModal from '../components/input-modal.jsx';
import ConfirmModal from '../components/confirm-modal.jsx';
import { Dispatcher } from 'consus-core/flux';

import { checkOutItems } from '../../lib/api-client';

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
            adminCodeRequired: AuthenticationStore.overrideNeeded(),
            adminCode: AuthenticationStore.getAdminCode()
        };
    }

    cancel() {
        Dispatcher.handleAction('CLEAR_ITEMS');
    }

    checkOut() {
        if(CartStore.getItems().length > 0)
            checkOutItems(this.state.student.id, this.state.itemAddresses, this.state.adminCode);
        else Dispatcher.handleAction('ERROR', {
            error: 'No Items were scanned for checkout.'
        })
    }

    cancelAdminModal(){
        Dispatcher.handleAction("CLEAR_ADMIN_WINDOW");
    }


    closeAdminModal(adminCode){
        if (adminCode.length > 0)
            Dispatcher.handleAction("ADMIN_CODE_ENTERED", {adminCode});
        //Automatically Checkout after admin scan or pin.
        this.checkOut();
    }

    render() {
        return (
            <div id='student'>
                <StudentPanel student={this.state.student} />
                <CartPanel itemAddresses={this.state.itemAddresses} cancel={this.cancel.bind(this)} submit={this.checkOut.bind(this)} student={this.state.student} />
                <div className='clear'></div>
                <InputModal
                    message='Please Scan Admin ID or Enter Admin Pin:'
                    active = {this.state.adminCodeRequired}
                    onAccept= {this.closeAdminModal.bind(this)}
                    onCancel={this.cancelAdminModal.bind(this)}
                    acceptText='Continue Checkout'
                    textHidden={true}
                />
                <ConfirmModal
                    message="Confirm?"
                    active = {true}
                    onSelect = {bool => console.log('Conf:', bool)}
                />
            </div>
        );
    }

}
