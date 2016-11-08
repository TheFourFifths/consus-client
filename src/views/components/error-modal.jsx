import React from 'react';
import ErrorStore from '../../store/error-store';
import ListenerComponent from '../../lib/listener-component.jsx';
import Modal from './modal.jsx';

export default class ErrorModal extends React.Component {

    render() {
        if (!ErrorStore.hasError()) {
            return false;
        }

        return (
            <Modal active={true} onClose={this.props.onClose}>
                <p>{this.props.message}</p>
            </Modal>
        );
    }

}
