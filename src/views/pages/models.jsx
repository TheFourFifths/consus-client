import React from 'react';
import ListenerComponent from '../../lib/listener-component.jsx';
import ModelStore from '../../store/model-store';
import Model from '../components/model.jsx';
import CartController from '../../controllers/components/cart-panel'
import {Link} from 'react-router';
import InputModal from '../components/input-modal.jsx';
import {readAddress} from 'consus-core/identifiers';

export default class Models extends ListenerComponent {

    constructor() {
        super();

    }

    getStores() {
        return [
            ModelStore
        ];
    }

    getState() {
        return {
            models: ModelStore.getAllModels(),
            lostItemModalActive: false,
            inputModalAcceptDisabled: true
        };
    }

    acceptItemLostAddress(equipmentAddress) {
        CartController.turnInLostEquipment(equipmentAddress);
        this.cancelItemLost();

    }

    lostItem() {
        this.setState({lostItemModalActive: true})
    }

    cancelItemLost() {
        this.setState({lostItemModalActive: false})
    }

    update(e) {
        let equipmentAddress = e.target.value;
        if (equipmentAddress.length > 8) {
            try {
                readAddress(equipmentAddress);
                this.setState({
                    inputModalIsInvalid: undefined,
                    inputModalAcceptDisabled: false
                });
            } catch (error) {
                this.setState({
                    inputModalIsInvalid: true,
                    inputModalAcceptDisabled: true
                });
            }
        }
        this.setState({
            inputModalInput: equipmentAddress
        })
    }

    render() {
        return (
            <div id="models">
                <InputModal
                    message='Please enter the item/model address located under the barcode'
                    active={this.state.lostItemModalActive}
                    onAccept={this.acceptItemLostAddress.bind(this)}
                    onCancel={this.cancelItemLost.bind(this)}
                    update={this.update.bind(this)}
                    errorMessage='Equipment address is incorrect.'
                    acceptText='Enter'
                    textHidden={false}
                    input={this.state.inputModalInput}
                    invalid={this.state.inputModalIsInvalid}
                    acceptDisabled={this.state.inputModalAcceptDisabled}
                />
                <h1>All models</h1>
                <Link to='/models/new'>Make new model</Link>
                <button id='btnLostItem' onClick={this.lostItem.bind(this)}> Lost Item? Click here!</button>
                {this.state.models.map((model) => {
                    return (
                        <div key={model.address + model.count}>
                            <Model model={model}/>
                        </div>
                    );
                })}
            </div>
        );
    }

}
