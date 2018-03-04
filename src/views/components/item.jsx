import React from 'react';
import ItemStore from '../../store/item-store';
import ModelStore from '../../store/model-store';
import ItemController from '../../controllers/components/item';
import PrinterController from '../../controllers/pages/printer';
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

    goToModel(address) {
        ItemController.goToModel(address);
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

    formatStatusString(status) {
        let words = status.split("_");
        let result = "";
        for(let word of words) {
            result += (word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() + " ");
        }
        return result.slice(0, -1);
    }

    render() {
        if (this.state.item === null)
            return (<i>Item is loading...</i>);
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
                    <strong><span className='itemName' onClick={this.goToModel.bind(this, this.state.model.address)}>{this.state.model.name}</span></strong><br/>
                    <i>{this.state.item.address}<br/></i>
                    <span className={`status ${this.state.item.status}`}>{this.formatStatusString(this.state.item.status)}</span>
                </div>
                <div className="faultArea">
                    <div className="faultInput" key={'' + this.state.item.address + this.state.item.faultHistory.length}>
                        <h3>Current Fault:</h3>
                        <div className='currentFault'>
                            {(this.state.item.isFaulty
                                    ? <span><img className='icon-button' onClick={() => ItemController.removeItemFault(this.state.item.address)} src="../assets/images/clear.svg" title="Remove Fault"/>{this.state.item.faultHistory[0].description}</span>
                                    : (this.state.faultBoxOpen ?
                                        <span><input className='faultTextBox' ref={'' + this.state.item.address + 'fault'} placeholder="Enter Fault" autoFocus />
                                        <img className='icon-button cancel' onClick={this.cancelFault.bind(this)} src="../assets/images/cancel.svg" title="Cancel" />
                                        <img className='icon-button save' onClick={this.addFault.bind(this)} src="../assets/images/check.svg" title="Save" /></span>
                                        : <span><img className='icon-button' onClick={this.addFault.bind(this)} src="../assets/images/add-3.svg" title="Add Fault" /><i>Item is not currently faulty.</i></span>
                                    )
                            )}
                        </div>
                    </div>
                    <div className="faultHistory">
                        <h3>Fault History:</h3>
                        <div className="faults">
                            {this.state.item.faultHistory.length === 0 ? <i>No fault history for this item</i> :(this.state.item.faultHistory.map((fault, index) => {
                                if (index === 0 && this.state.item.isFaulty) return null;
                                let timestamp = moment.tz(fault.timestamp * 1000, config.get('timezone')).format('MMM D Y');
                                return <div key={fault.description + fault.timestamp + new Date().getTime()}>{timestamp}: {fault.description}</div>;
                            }))}
                        </div>
                    </div>
                </div>
                <div className="actionArea">
                    <img className='icon-button' onClick={this.showDeleteConfirmModal.bind(this)} src="../assets/images/delete.svg"/>
                    <img className='icon-button' onClick={this.openQr.bind(this)} src='../assets/images/qr.svg' />
                </div>
                <div className="clear"></div>
            </div>
        );
    }
}
