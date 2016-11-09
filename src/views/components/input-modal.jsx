import React from 'react';
import Modal from './modal.jsx';

export default class InputModal extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            input: ''
        }
    }

    onClose(){
        this.props.onClose(this.state.input);
    }

    update(e){
        this.setState({input:e.target.value});
    }

    render() {
        return (
            <Modal active={this.props.active} onClose={this.onClose.bind(this)}>
                <p>{this.props.message}</p><br/>
                <input onChange={this.update.bind(this)} value={this.state.input}/>
            </Modal>
        )
    }
}
