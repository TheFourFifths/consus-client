import React from 'react';
import { Dispatcher } from 'consus-core/flux';
import AuthenticationStore from '../store/authentication-store';

import ListenerComponent from '../lib/listener-component.jsx';
import Omnibar from './components/omnibar.jsx';
import ErrorModal from './components/error-modal.jsx';

export default class App extends ListenerComponent {

    constructor() {
        super();
    }

    getStores() {
        return [AuthenticationStore];
    }

    getState() {
        return {
            loggedIn: AuthenticationStore.loggedIn()
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
                <ErrorModal active={true} onClose={this.closeError} message="Sorry, I can't let you do that" />
                <Omnibar />
                {this.props.children}
            </div>
        );
    }

}
