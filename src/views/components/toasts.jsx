import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Toast from './toast.jsx';
import ToastsController from '../../controllers/components/toasts';


export default class Toasts extends React.Component {
    render() {
        return (
            <div id='toasts'>
                <ReactCSSTransitionGroup transitionName='toast' transitionEnterTimeout={700} transitionLeaveTimeout={300}>
                    {this.props.toasts.map(toast => {
                        return (
                            <Toast key={toast.id} onPop={ToastsController.popToast.bind(this, toast.id)} timeout={toast.timeout}>
                                {toast.text}
                            </Toast>
                        );
                    })}
                </ReactCSSTransitionGroup>
            </div>
        );
    }

}
