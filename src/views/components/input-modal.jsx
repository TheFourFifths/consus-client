import React from 'react';
import Modal from './modal.jsx';

export default class InputModal extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            input: '',
            invalid: false
        };
    }

    onAccept(){
        this.setState({input:''});
        this.props.onAccept(this.props.input === undefined ? this.state.input : this.props.input);
    }

    update(e){
        let regex = new RegExp("^[a-zA-Z0-9]*$");
        if(regex.test(e.target.value)) {
            this.setState({input: e.target.value, invalid: false});
        }else{
            this.setState({invalid: true});
        }
    }

    onCancel(){
        this.setState({input:''});
        this.props.onCancel();
    }

    renderWarning(){
        if(this.state.invalid === undefined ? this.state.invalid : this.props.invalid){
            return <span className="invalidText">{this.props.errorMessage === undefined ? 'Please only use alspanhanumeric characters.' : this.props.errorMessage}</span>;
        }else{
            return '';
        }
    }

    render() {
        return (
            <Modal
                active={this.props.active}
                buttonText={this.props.acceptText}
                onClose={this.onAccept.bind(this)}
                acceptDisabled={this.props.acceptDisabled}>
                <p>{this.props.message}</p>
                <input
                    maxLength="30"
                    type={this.props.textHidden? 'password' : 'text'}
                    onChange={this.props.update === undefined ? this.update.bind(this) : this.props.update.bind(this)}
                    value={this.props.input === undefined ? this.state.input : this.props.input}
                />
                <br/>
                <p>{this.renderWarning()}</p>
                <button onClick={this.onCancel.bind(this)}>Cancel</button>
            </Modal>
        );
    }
}
