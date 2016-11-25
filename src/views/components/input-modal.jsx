import React from 'react';
import Modal from './modal.jsx';

export default class InputModal extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            input: '',
            invalid: false
        }
    }

    onAccept(){
        this.setState({input:''});
        this.props.onAccept(this.state.input);
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
        if(this.state.invalid){
            return <span className="invalidText">Please only use Alphanumeric characters.<br/></span>
        }else{
            return '';
        }
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
                {this.renderWarning()}
                <button onClick={this.onCancel.bind(this)}>Cancel</button>
            </Modal>
        )
    }
}
