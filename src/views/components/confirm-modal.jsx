import React from 'react';
import Modal from './modal.jsx';

export default class ConfirmModal extends React.Component {


    render() {
        return (
            <Modal
                active={this.props.active}
                buttonText="Yes"
                onClose={() => this.props.onSelect(true)}>
                <p>{this.props.message}</p><br/>
                <br/>
                <button onClick={() => this.props.onSelect(false)}>No</button>
            </Modal>
        )
    }
}
