import React from 'react';
import { Dispatcher } from 'consus-core/flux';
import AuthenticationStore from '../store/authentication-store';
import ErrorStore from '../store/error-store';
import ToastStore from '../store/toast-store';

import ListenerComponent from '../lib/listener-component.jsx';
import Omnibar from './components/omnibar.jsx';
import Models from './pages/models.jsx';
import ErrorModal from './components/error-modal.jsx';
import Toast from './components/toast.jsx';

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

    popToast(id) {
        Dispatcher.handleAction('POP_TOAST', {
            id
        });
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
                <ErrorModal active={ErrorStore.hasError()} onClose={this.closeError} message={this.state.errorMessage} />
                <div id='toasts'>
                    {this.state.toasts.map(t => <Toast key={t.id} onPop={this.popToast.bind(this, t.id)}>{t.text}</Toast>)}
                </div>
                <Omnibar />
                <div id='children'>
                  {this.props.children}
                </div>
            </div>
        );
    }

}
