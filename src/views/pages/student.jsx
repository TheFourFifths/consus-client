import React from 'react';

import ListenerComponent from '../../lib/listener-component.jsx';
import StudentStore from '../../store/student-store';
import CartStore from '../../store/cart-store';
import StudentPanel from '../components/student-panel.jsx';
import CartPanel from '../components/cart-panel.jsx';

import { checkOutItems } from '../../lib/api-client';

export default class Student extends ListenerComponent {

    constructor() {
        super();
    }

    getStores() {
        return [
            StudentStore,
            CartStore
        ];
    }

    getState() {
        return {
            student: StudentStore.getStudent(),
            itemAddresses: CartStore.getItems().map(item => item.address)
        };
    }

    checkOut() {
        checkOutItems(this.state.student.id, this.state.itemAddresses);
    }

    render() {
        return (
            <div id='student'>
                <StudentPanel student={this.state.student} />
                <CartPanel itemAddresses={this.state.itemAddresses} submit={this.checkOut.bind(this)} student={this.state.student} />
                <div className='clear'></div>
            </div>
        );
    }

}
