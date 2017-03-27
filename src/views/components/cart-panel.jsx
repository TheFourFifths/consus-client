import React from 'react';
import { readAddress } from 'consus-core/identifiers';
import CartController from '../../controllers/components/cart-panel';
import Modal from './modal.jsx';
import { assert } from 'chai';
import CartStore from '../../store/cart-store';
export default class CartPanel extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            address: '',
            active: false,
            isLongterm: false
        };
    }

    changeAddress(e) {
        let regex = new RegExp("^[a-zA-Z0-9]*$");
        if(regex.test(e.target.value)) {
            try {
                let result = readAddress(e.target.value);
                let student = this.props.student;
                if(result.type == 'item') {
                    if (student.items.some(item => item.address === e.target.value)) {
                        CartController.checkInItem(student.id, e.target.value);
                    } else {
                        CartController.getItem(e.target.value);
                    }
                } else if(result.type == 'model') {
                    if(this.props.equipment.find(content => { return content.address === e.target.value; })){
                        CartController.incrementModel(e.target.value);
                    } else {
                        CartController.getModel(e.target.value);
                    }
                }
                this.setState({
                    address: ''
                });
            } catch (f) {
                this.setState({
                    active: false,
                    address: e.target.value
                });
            }
        }else{
            CartController.throwError("Please only enter Alphanumeric Characters.");
        }
    }

    renderEquipment() {
        if(this.props.equipment.length === 0) {
            return <div><br/><i>Cart is empty.</i><br/><br/></div>;
        }
        return (
            <ul className='cartItems'>
                {this.props.equipment.map((content, i) => {
                    if(content.quantity) {
                        return <li className="cartModel" key={i}>{content.address} x{content.quantity}</li>;
                    } else {
                        return <li className="cartItem" key={i}>{content.address}</li>;
                    }
                })}
            </ul>
        );
    }

    closeModal() {
        this.setState({
            active: false,
            address: this.state.address
        });
    }

    changeIsLongterm(e){
        CartController.changeIsLongterm(e.target.checked);
    }

    changeLongtermDate(e){
        CartController.changeLongtermDate(e.target.value);
    }

    changeLongtermProfessor(e){
        CartController.changeLongtermProfessor(e.target.value);
    }

    renderLongtermSection(){
        if(CartStore.getIsLongterm()){
            return <div id="longtermSection">
                Longterm duedate: <input type="date" onChange={this.changeLongtermDate.bind(this)}/><br />
                Professor's name: <input type="text" onChange={this.changeLongtermProfessor.bind(this)} /><br />
            </div>
        }
    }

    render() {
        return (
            <div className='cart'>
                <Modal active={this.state.active} onClose={this.closeModal.bind(this)} >You successfully checked in an Item.<br/></Modal>
                <h3>Cart</h3>
                <input type='text' maxLength="30" onChange={this.changeAddress.bind(this)} value={this.state.address} placeholder='Equipment ID' autoFocus/>
                {this.renderEquipment()}
                Is this a longterm checkout? <input type="checkbox" checked={CartStore.getIsLongterm()} onChange={this.changeIsLongterm.bind(this)} /><br />
                {this.renderLongtermSection()}
                <input type='button'  onClick={this.props.submit} value='Complete Checkout' />
                <input type='button' onClick={this.props.cancel} value='Cancel' />
            </div>
        );
    }

}
