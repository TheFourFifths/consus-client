import React from 'react';
import Modal from './modal.jsx';

export default class DateModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            date: undefined
        };
    }

    changeDate(e) {
        this.setState({
            date: e.target.value
        });
    }

    render() {
        return (<Modal
                active={this.props.active}
                buttonText="Confirm"
                onClose={() => this.props.onDateSelected(this.state.date)}
                buttons={<button onClick={() => this.props.onDateSelected(undefined)} className='default-btn'>Cancel</button>}>
                <h4>{this.props.message}</h4>
                <span className='modal-input-area'>
                    <input type="date" className='modal-input' onChange={this.changeDate.bind(this)}/>
                </span>
            </Modal>
        );
    }
}
