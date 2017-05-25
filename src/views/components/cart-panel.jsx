import React from 'react';
import { readAddress } from 'consus-core/identifiers';
import CartController from '../../controllers/components/cart-panel';
import StudentPanelController from '../../controllers/components/student-panel';
import CartStore from '../../store/cart-store';
import StudentPageController from '../../controllers/pages/student';

export default class CartPanel extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            address: '',
            isLongterm: false
        };
    }

    changeAddress(e) {
        let regex = new RegExp("^[a-zA-Z0-9]*$");
        if(regex.test(e.target.value)) {
            try {
                let result = readAddress(e.target.value);
                let student = this.props.student;
                if (result.type === 'item') {
                    let item = student.items.find(i => i.address === e.target.value);
                    if (item === undefined) {
                        CartController.getItem(e.target.value);
                    } else if (item.status === 'CHECKED_OUT') {
                        CartController.checkInItem(student.id, e.target.value);
                    } else if (item.status === 'SAVED') {
                        StudentPanelController.retrieveItem(e.target.value);
                    }
                } else if (result.type === 'model') {
                    let model = student.models.find(m => m.address === e.target.value);
                    if (model && model.status === 'SAVED') {
                        StudentPanelController.retrieveModel(student.id, e.target.value);
                    } else if (this.props.equipment.find(m => m.address === e.target.value)) {
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
                    address: e.target.value
                });
            }
        }else{
            CartController.throwError("Please only enter Alphanumeric Characters.");
        }
    }

    renderEquipment() {
        if(this.props.equipment.length === 0) {
            return <div><br/><i>Cart is empty.<br/>Scan an item or model barcode to add it to the cart, or scan an item the student has checked out to return it.</i><br/><br/></div>;
        }
        return (
            <ul className='cartItems'>
                {this.props.equipment.map((content, i) => {
                    console.log(content);
                    let result = readAddress(content.address);
                    if (result.type === 'model') {
                        StudentPageController.getModel(content.address).then(model => {
                            console.log(`model = ${model}`);
                            return <li className="cartModel" key={i}>
                                <span className="quantity">{content.quantity}&times;&nbsp;</span>
                                <span className="name">{model.name} </span>
                                <span className="addr">{content.address}</span>
                            </li>;
                        });
                    } else if (result.type === 'item') {
                        let item = StudentPageController.getItem(content.address);
                        console.log(`item = ${item}`);
                        let model = StudentPageController.getModel(item.modelAddress);
                        console.log(`model = ${model}`);
                        return <li className="cartItem" key={i}>
                            <span className="name">{model.name} </span>
                            <span className="addr">{item.address}</span>
                        </li>;
                    }
                })}
            </ul>
        );
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
                Professor's name: <input autoFocus type="text" onChange={this.changeLongtermProfessor.bind(this)} /><br />
            </div>;
        }
    }

    render() {
        return (
            <div className='cart'>
                <h3>Cart</h3>
                <input type='text' maxLength="30" onChange={this.changeAddress.bind(this)} value={this.state.address} placeholder='Equipment ID' autoFocus/>
                {this.renderEquipment()}
                <p>
                    Is this a longterm checkout?
                    <input type="checkbox" checked={CartStore.getIsLongterm()} onChange={this.changeIsLongterm.bind(this)} />
                    {this.renderLongtermSection()}
                </p>
                <input type='button' className="cool-button" onClick={this.props.submit} value='Complete Checkout'
                    disabled={CartStore.getContents().length <= 0} />
                <br/>
                <input type='button' className="neat-secondary-button" onClick={this.props.cancel} value='Clear Cart' />
            </div>
        );
    }

}
