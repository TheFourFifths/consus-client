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
        setState({input:e.target.value});
    }

    render() {
        console.log('render');
        return (
            <Modal active={this.props.active} onClose={this.onClose}>
                <p>{this.props.message}</p><br/>
                <input onChange={update} value={this.state.input}/>
            </Modal>
        )
    }
}
