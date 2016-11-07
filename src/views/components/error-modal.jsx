import React from 'react';
import Modal from './modal.jsx';

export default class ErrorModal extends React.Component {

    render() {
        if (!this.props.active) {
            return false;
        }

        return (
            <Modal active={true} onClose={this.props.onClose}>
                <p>{this.props.message}</p>
            </Modal>
        );
    }

}
