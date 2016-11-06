import React from 'react';
import Modal from 'modal.jsx';
import { Disapatcher } from 'consus-core/flux';
import ErrorStore from '../../store/error-store';

export default class ErrorModal extends Modal {

    constructor() {
        super();
    }

    getStores() {
        return [ErrorStore];
    }

    getState() {
        return {
            tag: ErrorStore.getTag();
            error: ErrorStore.getError();
        };
    }

    clearError() {
        Dispatcher.handleAction('CLEAR_ERROR', {});
    }

    render() {
        if (!ErrorStore.hasError()) {
            return false;
        }

        return (
            <div className='modal'>
                <div className='modal-content {this.state.tag.toLowerCase()}'>
                    <h3>{this.state.tag}</h3>
                    {this.state.error}
                </div>
                <button type='button' onClick='clearError'>Close</button>
            </div>
        );
    }

}
