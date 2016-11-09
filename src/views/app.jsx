import React from 'react';
import { Dispatcher } from 'consus-core/flux';
import AuthenticationStore from '../store/authentication-store';
import ErrorStore from '../store/error-store';

import ListenerComponent from '../lib/listener-component.jsx';
import Omnibar from './components/omnibar.jsx';
import Models from './pages/models.jsx';
import ErrorModal from './components/error-modal.jsx';

export default class App extends ListenerComponent {

    constructor() {
        super();
    }

    getStores() {
        return [AuthenticationStore, ErrorStore];
    }

    getState() {
        return {
            hasError: ErrorStore.hasError(),
            loggedIn: AuthenticationStore.loggedIn(),
            errorTag: ErrorStore.getTag(),
            errorMessage: ErrorStore.getError()
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
                <ErrorModal active={ErrorStore.hasError()} onClose={this.closeError} message={this.state.errorMessage} />
                <Omnibar />
                <div id='children'>
                  {this.props.children}
                </div>
            </div>
        );
    }

}
