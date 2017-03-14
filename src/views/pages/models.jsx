import React from 'react';
import ListenerComponent from '../../lib/listener-component.jsx';
import ModelStore from '../../store/model-store';
import Model from '../components/model.jsx';
import CartController from '../../controllers/components/cart-panel'
import { Link } from 'react-router';
import InputModal from '../components/input-modal.jsx';
// import { readAddress } from 'consus-core/identifiers';
// import { Dispatcher } from 'consus-core/flux';
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
            lostItemModalActive: false

        };
    }
    acceptItemLostAddress(equipmentAddress){
        CartController.turnInLostEquipment(equipmentAddress);
        this.cancelItemLost();

    }
    lostItem(){
        this.setState({lostItemModalActive: true})
    }

    cancelItemLost(){
        this.setState({lostItemModalActive: false})
    }

    update(){
        console.log('test');
    }

    render() {
        return (
            <div id="models">
                <InputModal
                    message='Please enter the item/model address located under the barcode'
                    active = {this.state.lostItemModalActive}
                    onAccept= {this.acceptItemLostAddress.bind(this)}
                    onCancel={this.cancelItemLost.bind(this)}
                    update={this.update.bind(this)}
                    acceptText='Enter'
                    textHidden={false}
                />
                <h1>All models</h1>
                <Link to='/models/new'>Make new model</Link>
                <button onClick={this.lostItem.bind(this)} > Lost Item? Click here! </button>
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
