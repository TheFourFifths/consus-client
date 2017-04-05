import React from 'react';
import { Link } from 'react-router';
import ItemStore from '../../store/item-store';
import ModelStore from '../../store/model-store';
import ItemController from '../../controllers/components/item';
import PrinterController from '../../controllers/pages/printer';
import ModelPageController from '../../controllers/pages/model';
import ConfirmModal from '../components/confirm-modal.jsx';
import config from 'config';
import moment from 'moment-timezone';

export default class Item extends React.Component {

    constructor(props) {
        super(props);
        if (props.item === undefined)
            this.state = {
                item: null,
                model: null,
                needsConfirmationForDelete: false,
                faultBoxOpen: false
            };
        else
            this.state = {
                item: props.item,
                model: ModelStore.getModelByAddress(props.item.modelAddress),
                needsConfirmationForDelete: false,
                faultBoxOpen: false
            };
    }

    componentDidMount() {
        if (this.state.item === null) {
            ItemController.getItem(this.props.params.address).then(() => {
                this.setState({
                    item: ItemStore.getItem(),
                    model: ModelStore.getModelByAddress(ItemStore.getItem().modelAddress)
                });
            });
        }
    }

    addFault() {
        if (this.state.faultBoxOpen)
            ItemController.addFault({
                itemAddress: this.state.item.address,
                fault: this.refs['' + this.state.item.address + 'fault'].value
            });
        else
            this.setState({faultBoxOpen: true});
    }

    cancelFault() {
        this.setState({faultBoxOpen: false});
    }

    showDeleteConfirmModal(){
        this.setState({
            needsConfirmationForDelete: true
        });
    }

    confirmDelete(bool){
        if(bool) {
            ItemController.deleteItem(this.state.item);
        }
        this.setState({
            needsConfirmationForDelete: false
        });
    }

    openQr() {
        PrinterController.promptToPrint(this.state.item.address);
    }

    render() {
        if (this.state.item === null)
            return <i>Item is loading...</i>;
        let deleteConfirmationText = `Are you sure you want to delete this item (${this.state.item.address})?`;
        return (
            <div className='item'>
                <ConfirmModal
                    message={deleteConfirmationText}
                    active={this.state.needsConfirmationForDelete}
                    onSelect={bool => this.confirmDelete(bool)}
                />
                <div className="picArea">
                    <img src={`data:image/jpeg;base64,${this.state.model.photo}`}/>
                </div>
                <div className="titleArea">
                    <strong><Link to={`/model/${this.state.model.address}`}>{this.state.model.name}</Link></strong><br/>
                    <i>{this.state.item.address}<br/></i>
                    <strong>Status:</strong> {this.state.item.status}
                </div>
                <div className="infoArea">
                    <div key={'' + this.state.item.address + this.state.item.faultHistory.length} className="faultArea">
                        <h3>Current Fault</h3>
                        {(this.state.item.isFaulty
                                ? <span><button onClick={() => ItemController.removeItemFault(this.state.item.address)}>ClearFault</button><p>{this.state.item.faultHistory[0].description}</p></span>
                                : <p>Item is not currently faulty.</p>
                        )}

                        <br/>
                        {this.state.faultBoxOpen ? <input ref={'' + this.state.item.address + 'fault'} /> : <br /> }
                        <button className={this.state.faultBoxOpen ? "saveButton" : "addFault" } onClick={this.addFault.bind(this)}>{this.state.faultBoxOpen ? "Save Fault" : "Add Fault" }</button>
                        {this.state.faultBoxOpen ? <button onClick={this.cancelFault.bind(this)}> Cancel </button> : ""}
                    </div>
                    <div className="faultHistory">
                        <h3>Fault History:</h3>
                        <div className="faults">
                            {this.state.item.faultHistory.length === 0? <p>No fault history for this item</p> :(this.state.item.faultHistory.map((fault, index) => {
                                if (index === 0 && this.state.item.isFaulty) return null;
                                let timestamp = moment.tz(fault.timestamp * 1000, config.get('timezone')).format('MMM D Y');
                                return <div key={fault.description + fault.timestamp + new Date().getTime()}>{timestamp}: {fault.description}</div>;
                            }))}
                        </div>
                    </div>
                </div>
                <div className="actionArea">
                    <img onClick={this.showDeleteConfirmModal.bind(this)} src="../assets/images/delete.svg"/>
                    <img onClick={this.openQr.bind(this)} src='../assets/images/qr.svg' />
                </div>
                <div className="clear"></div>
            </div>
        );
    }

}
