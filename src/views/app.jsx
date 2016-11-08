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
            loggedIn: AuthenticationStore.loggedIn(),
            errorTag: ErrorStore.getTag(),
            errorMessage: ErrorStore.getError()
        };
    }

    closeError() {
        Dispatcher.handleAction('CLEAR_ERROR', {});
    }

    makeError() {
        console.log('Error!');
        Dispatcher.handleAction('ERROR', {
            error: 'Skyrim is being played'
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
                <button type='button' onClick={this.makeError}>Error!</button>
                <ErrorModal active={ErrorStore.hasError()} onClose={this.closeError} message={this.state.errorMessage} />
                <Omnibar />
                {this.props.children}
            </div>
        );
    }

}
