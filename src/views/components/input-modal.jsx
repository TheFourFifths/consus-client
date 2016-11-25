import React from 'react';
import Modal from './modal.jsx';

export default class InputModal extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            input: ''
        }
    }

    onAccept(){
        //TODO: Check for special characters.
        this.setState({input:''});
        this.props.onAccept(this.state.input);
    }

    update(e){
        this.setState({input:e.target.value});
    }

    onCancel(){
        this.setState({input:''});
        this.props.onCancel();
    }

    render() {
        return (
            <Modal
                active={this.props.active}
                buttonText={this.props.acceptText}
                onClose={this.onAccept.bind(this)}>
                <p>{this.props.message}</p><br/>
                <input
                    maxLength="30"
                    type={this.props.textHidden? 'password' : 'text'}
                    onChange={this.update.bind(this)}
                    value={this.state.input}/>
                <br/>
                <button onClick={this.onCancel.bind(this)}>Cancel</button>
            </Modal>
        )
    }
}
