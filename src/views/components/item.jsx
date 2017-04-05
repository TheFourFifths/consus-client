import React from 'react';
import ItemStore from '../../store/item-store';
import ItemController from '../../controllers/components/item';
import PrinterController from '../../controllers/pages/printer';
import ModelController from '../../controllers/pages/model';
import config from 'config';
import moment from 'moment-timezone';

export default class Item extends React.Component {

    constructor(props) {
        super(props);
        if (props.item === undefined)
            this.state = {item: null};
        else
            this.state = {item: props.item};

        this.setState({ faultBoxOpen: false });

        this.state.noButtons = props.noButton === undefined? false: props.noButton;
    }

    componentDidMount() {
        if (this.state.item === null) {
            ItemController.getItem(this.props.params.address).then(() => {
                this.setState({
                    item: ItemStore.getItem()
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

    deleteItem() {
        ItemController.deleteItem(this.state.item);
    }

    openQr() {
        PrinterController.promptToPrint(this.state.item.address);
    }

    renderButtons() {
        if(this.state.noButtons) return null;
        return  (
            <span>
                <button className={this.state.faultBoxOpen ? "saveButton" : "addFault" } onClick={this.addFault.bind(this)}>{this.state.faultBoxOpen ? "Save Fault" : "Add Fault" }</button>
                {this.state.faultBoxOpen ? <button onClick={this.cancelFault.bind(this)}> Cancel </button> : ""}
            </span>
        )
    }

    render() {
        if (this.state.item === null)
            return <i>Item is loading...</i>;
        return (
            <div className='item'>
                <div className="picArea">
                    <img src="../assets/images/placeholder.jpg"/>
                </div>
                <div className="titleArea">
                    <h2>{this.state.item.address}</h2>
                    <button id='parent-model' onClick={() => ModelController.getModelAndItems(this.state.item.modelAddress)}>View model</button><br/>
                </div>
                <div className="infoArea">
                    <div className="descriptionArea">
                        <h3>Status</h3>
                        <p>{this.state.item.status}</p>
                    </div>
                    <div key={'' + this.state.item.address + this.state.item.faultHistory.length}
                     className="faultArea">
                        <h3>Current Fault</h3>
                        {(this.state.item.isFaulty && !this.state.noButtons
                                ? <span><button onClick={() => ItemController.removeItemFault(this.state.item.address)}>ClearFault</button><p>{this.state.item.faultHistory[0].description}</p></span>
                                : <p>Item is not currently faulty.</p>
                        )}

                        <br/>
                        {this.state.faultBoxOpen ? <input ref={'' + this.state.item.address + 'fault'} /> : <br /> }
                        {this.renderButtons()}
                    </div>
                    <div className="faultHistory">
                        <h3>Fault History:</h3>
                        {this.state.item.faultHistory.length === 0? <p>No fault history for this item</p> :(this.state.item.faultHistory.map((fault, index) => {
                            if (index === 0 && this.state.item.isFaulty) return null;
                            let timestamp = moment.tz(fault.timestamp * 1000, config.get('timezone')).format('MMM D Y, h:mm a');
                            return <div key={fault.description + fault.timestamp + new Date().getTime()}>{timestamp}: {fault.description}</div>;
                        }))}
                    </div>
                </div>
                <div className="actionArea">
                    <img src="../assets/images/add.svg"/>
                    <img src="../assets/images/edit.svg"/>
                    <img onClick={this.deleteItem.bind(this)} src="../assets/images/delete.svg"/>
                    <img onClick={this.openQr.bind(this)} src='../assets/images/qr.svg' />
                </div>
                <div className="clear"></div>
            </div>
        );
    }

}
