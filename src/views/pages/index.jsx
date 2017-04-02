import React from 'react';
import { hashHistory } from 'react-router';
import { readAddress } from 'consus-core/identifiers';
import CartController from '../../controllers/components/cart-panel';
import IndexController from '../../controllers/pages/index';
import InputModal from '../components/input-modal.jsx';

export default class Index extends React.Component {

    constructor() {
        super();
        this.state = { lostItemModalActive: false };
    }

    acceptItemLostAddr(equipAddr) {
        CartController.turnInLostEquipment(equipAddr);
        this.cancelItemLost();
    }

    lostItem() {
        this.setState({ lostItemModalActive: true });
    }

    cancelItemLost() {
        this.setState({
            inputModalInput: '',
            inputModalIsInvalid: false,
            lostItemModalActive: false
        });
    }

    update(e) {
        let equipAddr = e.target.value;
        if (equipAddr.length > 0) {
            try {
                readAddress(equipAddr);
                this.setState({
                    inputModalIsInvalid: undefined,
                    inputModalAcceptDisabled: false
                });
            } catch (err) {
                this.setState({
                    inputModalIsInvalid: true,
                    inputModalAcceptDisabled: true
                });
            }
        }
        this.setState({ inputModalInput: equipAddr });
    }

    render() {
        return (
            <div id='index'>
                <InputModal
                    message='Please enter the item or model address located under the barcode.'
                    active={this.state.lostItemModalActive}
                    onAccept={this.acceptItemLostAddr.bind(this)}
                    onCancel={this.cancelItemLost.bind(this)}
                    update={this.update.bind(this)}
                    errorMessage='Equipment address is incorrect. Please double check adress!'
                    acceptText='Enter'
                    textHidden={false}
                    input={this.state.inputModalInput}
                    invalid={this.state.inputModalIsInvalid}
                    acceptDisabled={this.state.inputModalAcceptDisabled}
                />
                <div id='links'>
                    <div id='view-models' onClick={IndexController.getModels}>
                        <span>Models</span>
                    </div>
                    <div id='view-items' onClick={IndexController.getItems}>
                        <span>Items</span>
                    </div>
                    <div id='view-overdue' onClick={IndexController.getOverdueItems}>
                        <span>Overdue Equipment</span>
                    </div>
                    <div id='lost-item' onClick={this.lostItem.bind(this)}>
                        <span>Lost Item</span>
                    </div>
                    <div id='view-students' onClick={IndexController.getStudents}>
                        <span>Students</span>
                    </div>
                    <div id='student-upload' onClick={() => hashHistory.push(`/students/upload`)}>
                        <span>Upload Students</span>
                    </div>
                    <div id='create-item' onClick={IndexController.gotoNewItemPage}>
                        <span>New Item</span>
                    </div>
                    <div id='new-model' onClick={() => hashHistory.push(`/models/new`)}>
                        <span>New Model</span>
                    </div>
                </div>
            </div>
        );
    }

}
