import React from 'react';
import Modal from './modal.jsx';

export default class DateModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            date: undefined
        };
    }

    changeDate(e){
        this.setState({
            date: e.target.value
        });
    }

    render() {
        return (
            <Modal
                active={this.props.active}
                buttonText="Confirm"
                onClose={() => this.props.onDateSelected(this.state.date)}>
                <p>{this.props.message}</p><br/>
                <input type="date" onChange={this.changeDate.bind(this)}/>
                <br/>
                <button onClick={() => this.props.onDateSelected(undefined)}>Cancel</button>
            </Modal>
        )
    }
}
