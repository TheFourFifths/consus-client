import React from 'react';
import ListenerComponent from '../../lib/listener-component.jsx';
import { Disapatcher } from 'consus-core/flux/dispatcher';
import { ErrorStore } from '../../store/error-store';

export default class Modal extends ListenerComponent {

    constructor() {
        super();
    }
    // constructor(props) {
    //     super(props);
    // }

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
        Dispatcher.handleAction('CLEAR_ERRORS', {});
    }

    render() {
        if (!ErrorStore.hasError()) {
            return false;
        }

        return (
            <div className="modal">
                <!-- TODO add close 'X' in top-right -->
                <div className="modal-content {this.state.tag.toLowerCase()}">
                    <h3>{this.state.error.summary}</h3>
                    {this.state.error.message}
                    {this.props.children}
                </div>
                <!-- TODO add close button -->
                <button type="button" onClick="clearError">Close</button>
            </div>
        );
    }

}
