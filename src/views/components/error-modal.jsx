import React from 'react';
import Modal from './modal.jsx';

export default class ErrorModal extends React.Component {

    render() {
        return (
            <Modal active={this.props.active} onClose={this.props.onClose} btnClass={`${this.props.tag}-btn`}>
                <div className={`${this.props.tag}-heading modal-heading`}>
                    {this.props.tag}
                </div>
                <h4>{this.props.message}</h4>
            </Modal>
        );
    }

}
