import React from 'react';
import Modal from './modal.jsx';

export default class ErrorModal extends React.Component {

    render() {
        return (
            <Modal active={this.props.active} onClose={this.props.onClose}>
                <p>{this.props.message}</p>
            </Modal>
        );
    }

}
