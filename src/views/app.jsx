import React from 'react';
import { Dispatcher } from 'consus-core/flux';
import AuthenticationStore from '../store/authentication-store';
import ErrorStore from '../store/error-store';
import ToastStore from '../store/toast-store';

import ListenerComponent from '../lib/listener-component.jsx';
import Omnibar from './components/omnibar.jsx';
import ErrorModal from './components/error-modal.jsx';
import Toasts from './components/toasts.jsx';

export default class App extends ListenerComponent {

    getStores() {
        return [
            AuthenticationStore,
            ErrorStore,
            ToastStore
        ];
    }

    getState() {
        return {
            hasError: ErrorStore.hasError(),
            errorTag: ErrorStore.getTag(),
            errorMessage: ErrorStore.getError(),
            toasts: ToastStore.getToasts().slice(0, 3)
        };
    }

    closeError() {
        Dispatcher.handleAction('CLEAR_ERROR', {});
    }

    render() {
        return (
            <div id='app'>
                <ErrorModal active={ErrorStore.hasError()} onClose={this.closeError} message={this.state.errorMessage} />
                <Toasts toasts={this.state.toasts} />
                <div id='children'>
                  <Omnibar />
                  {this.props.children}
                </div>
            </div>
        );
    }

}
