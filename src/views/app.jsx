import React from 'react';
import { Dispatcher } from 'consus-core/flux';
import AuthenticationStore from '../store/authentication-store';
import ErrorStore from '../store/error-store';
import ToastStore from '../store/toast-store';

import ListenerComponent from '../lib/listener-component.jsx';
import Omnibar from './components/omnibar.jsx';
import Printer from './pages/printer.jsx';
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
            loggedIn: AuthenticationStore.loggedIn(),
            errorTag: ErrorStore.getTag(),
            errorMessage: ErrorStore.getError(),
            toasts: ToastStore.getToasts().slice(0, 3)
        };
    }

    closeError() {
        Dispatcher.handleAction('CLEAR_ERROR', {});
    }

    render() {
        if (!this.state.loggedIn) {
            return (
                <div id='app'>
                    <h1>Log in</h1>
                    <p>You must log in.</p>
                </div>
            );
        }
        return (
            <div id='app'>
                <ErrorModal active={ErrorStore.hasError()} onClose={this.closeError} tag={this.state.errorTag} message={this.state.errorMessage} />
                <Toasts toasts={this.state.toasts} />
                <Omnibar />
                <div id='children'>
                  {this.props.children}
                </div>
            </div>
        );
    }

}
