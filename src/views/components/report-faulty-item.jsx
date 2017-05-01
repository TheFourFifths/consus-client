import React from 'react';
import ItemStore from '../../store/item-store';
import ItemController from '../../controllers/components/item';
import config from 'config';
import moment from 'moment-timezone';

export default class ReportFaultyItem extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            item: props.item === undefined ? null : props.item
        };
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

    render() {
        if (this.state.item === null)
            return <i>Item is loading...</i>;
        return (
            <tr>
                <td className="centered">{this.state.item.address}</td>
                <td className="centered">{this.state.item.status}</td>
                <td className="centered">
                    {(this.state.item.isFaulty
                            ? <span><p>{this.state.item.faultHistory[0].description}</p></span>
                            : <p>Item is not currently faulty.</p>
                    )}
                </td>
                <td className="fault-list">
                    {this.state.item.faultHistory.length === 0? <p>No fault history for this item</p> :(this.state.item.faultHistory.map((fault, index) => {
                        if (this.state.item.faultHistory.length === 1 && this.state.item.isFaulty) return <p key={this.state.item.address + "nullkey"}>No other faults on this item.</p>;
                        if (index === 0 && this.state.item.isFaulty) return null;
                        let timestamp = moment.tz(fault.timestamp * 1000, config.get('timezone')).format('MMM D Y, h:mm a');
                        return <div key={fault.description + fault.timestamp + new Date().getTime()}>{timestamp}: {fault.description}</div>;
                    }))}
                </td>
            </tr>
        );
    }

}
