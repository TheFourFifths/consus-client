import React from 'react';
import ErrorStore from '../../store/error-store';
import Modal from './modal.jsx';

export default class ErrorModal extends React.Component {

    render() {
        if (!ErrorStore.hasError()) {
            return false;
        }

        return (
            <Modal active={ErrorStore.hasError()} onClose={this.props.onClose}>
                <p>{ErrorStore.getError()}</p>
            </Modal>
        );
    }

}
