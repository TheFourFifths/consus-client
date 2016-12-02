import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Dispatcher } from 'consus-core/flux';

import Toast from './toast.jsx';

export default class Toasts extends React.Component {

    popToast(id) {
        Dispatcher.handleAction('POP_TOAST', {
            id
        });
    }

    render() {
        return (
            <div id='toasts'>
                <ReactCSSTransitionGroup transitionName='toast' transitionEnterTimeout={700} transitionLeaveTimeout={300}>
                    {this.props.toasts.map(toast => {
                        return (
                            <Toast key={toast.id} onPop={this.popToast.bind(this, toast.id)} timeout={toast.timeout}>
                                {toast.text}
                            </Toast>
                        );
                    })}
                </ReactCSSTransitionGroup>
            </div>
        );
    }

}
