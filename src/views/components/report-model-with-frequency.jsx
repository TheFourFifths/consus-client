import React from 'react';
import ItemStore from '../../store/item-store';

export default class ReportModelWithFrequency extends React.Component {
    render() {
        let lastCheckoutDate = new Date(this.props.model.lastCheckedOut * 1000);
        return (
            <tr>
                <td className="centered">{this.props.model.name} ({this.props.model.address})</td>
                <td className="centered">{this.props.model.frequency?this.props.model.frequency:0}</td>
                <td className="centered">{lastCheckoutDate.getMonth() + 1}/{lastCheckoutDate.getUTCDate()}/{lastCheckoutDate.getFullYear()}</td>
            </tr>
        );
    }

}
