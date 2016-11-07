import React from 'react';
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
        console.log('Close');
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
                <ErrorModal active={true} onClose={this.closeError} message={'fuck'} />
                <Omnibar />
                {this.props.children}
            </div>
        );
    }

}
