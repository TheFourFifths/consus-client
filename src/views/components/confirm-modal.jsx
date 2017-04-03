import React from 'react';
import Modal from './modal.jsx';

export default class ConfirmModal extends React.Component {


    render() {
        return (
            <Modal
                active={this.props.active}
                buttonText="Yes"
                onClose={() => this.props.onSelect(true)}
                buttons={<button onClick={() => this.props.onSelect(false)} className='default-btn'>No</button>}>
                <h4>{this.props.message.split(/\n/g).map((line, index) => { return <span key={index}>{line}<br/></span>; })}</h4>
            </Modal>
        )
    }
}
