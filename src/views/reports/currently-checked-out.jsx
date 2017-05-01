import React from 'react';
import ListenerComponent from '../../lib/listener-component.jsx';
import CurrentlyCheckedOutReportPageController from '../../controllers/reports/currently-checked-out';
import ItemStore from '../../store/item-store';
import StudentStore from '../../store/student-store';
import ReportCheckedOutItem from '../components/report-checked-out-item.jsx';
import ReportCheckedOutModel from '../components/report-checked-out-model.jsx';

export default class CheckedOutItemReportPage extends ListenerComponent {

    componentWillMount(){
        CurrentlyCheckedOutReportPageController.getAllItems();
    }

    getStores(){
        return [
            ItemStore,
            StudentStore
        ];
    }

    getState(){
        return {
            items: ItemStore.getCheckedOutItems(),
            students: StudentStore.getAllStudents()
        };
    }

    renderItems(items) {
        if(items.length === 0) return <p>No serialized items checked out</p>;
        return (
            <table className="checked-out-items-report-table">
                <thead>
                    <tr>
                        <th>Item Name</th>
                        <th>Address</th>
                        <th>Checked Out To</th>
                        <th>Due On</th>
                    </tr>
                </thead>
                <tbody>
                {items.map(item => {
                    return <ReportCheckedOutItem key={item.address} item={item} />;
                })}
                </tbody>
            </table>
        );
    }

    renderModels(models) {
        if(models.length === 0) return <p>No non-serialized items checked out</p>;
        return (
            <table className="checked-out-items-report-table">
                <thead>
                    <tr>
                        <th>Model Name</th>
                        <th>Address</th>
                        <th>Quantity</th>
                        <th>Checked Out To</th>
                        <th>Due On</th>
                    </tr>
                </thead>
                <tbody>
                {models.map(model => {
                    return <ReportCheckedOutModel key={model.address + model.quantity} model={model}/>;
                })}
                </tbody>
            </table>
        );
    }

    render() {
        let models = Object.keys(this.state.students).filter(id =>  this.state.students[id].models.length > 0)
            .map(id => {
                let models = this.state.students[id].models;
                models.forEach(model => model.checkedOutTo = id);
                return models;
            }).reduce((acc, curr) => acc.concat(curr), []);
        return (
            <div key={this.state.items.length}>
                <h1>Checked Out Items</h1>
                <h3>Serialized Items:</h3>
                {this.renderItems(this.state.items)}
                <h3>Non-Serialized Items:</h3>
                {this.renderModels(models)}
            </div>
        );
    }
}
