import React from 'react';
import ListenerComponent from '../../lib/listener-component.jsx';
import CurrentlyCheckedOutReportPageController from '../../controllers/reports/currently-checked-out';
import ItemStore from '../../store/item-store';
import StudentStore from '../../store/student-store';
import ReportCheckedOutItem from '../components/report-checked-out-item.jsx';
import ReportCheckedOutModel from '../components/report-checked-out-model.jsx';

export default class CheckedOutItemReportPage extends ListenerComponent {

    constructor(props){
        super(props);
        this.state = {
            loading: true,
            sortItemBy: "Name",
            itemReversed: false,
            sortModelBy: "Name",
            modelReversed: false
        };
    }

    componentWillMount(){
        CurrentlyCheckedOutReportPageController.getAllItems().then(() => this.setState({loading:false}));
    }

    changeItemSort(e){
        let clicked = e.target.id.length > 0? e.target.id: this.state.sortItemBy;
        if(clicked === this.state.sortItemBy) this.setState({itemReversed: !this.state.itemReversed});
        else this.setState({sortItemBy: clicked, itemReversed: false});
    }

    changeModelSort(e){
        let clicked = e.target.id.length > 0? e.target.id: this.state.sortModelBy;
        if(clicked === this.state.sortModelBy) this.setState({modelReversed: !this.state.modelReversed});
        else this.setState({sortModelBy: clicked, modelReversed: false});
    }

    getStores(){
        return [
            ItemStore,
            StudentStore
        ];
    }

    getItemSortFunction(){
        switch(this.state.sortItemBy){
        case "Name":
            return function (a, b){return a.name.localeCompare(b.name);};
        case "Due":
            return function (a, b){return a.dueDate < b.dueDate;};
        }
    }

    getModelSortFunction(){
        switch(this.state.sortItemBy){
        case "Name":
            return function (a, b){return a.name.localeCompare(b.name);};
        case "Due":
            return function (a, b){return a.dueDate < b.dueDate;};
        }
    }

    getState(){
        return {
            items: ItemStore.getCheckedOutItems(),
            students: StudentStore.getAllStudents()
        };
    }

    renderItemList(items){
        let sorter = this.getItemSortFunction();
        let returned = items.sort(sorter).map(item => {
            return <ReportCheckedOutItem key={item.address} item={item} />;
        });
        if (this.state.reversed) returned.reverse();
        return returned;
    }

    renderItems(items) {
        if(items.length === 0) return <p>No serialized items checked out</p>;
        return (
            <table className="checked-out-items-report-table">
                <thead>
                    <tr>
                        <th className="report-table-header" id="Name" onClick={this.changeItemSort.bind(this)}>Item Name<span>{this.renderItemIcon('Name')}</span></th>
                        <th>Address</th>
                        <th>Checked Out To</th>
                        <th className="report-table-header" id="Due" onClick={this.changeItemSort.bind(this)}>Due On<span>{this.renderItemIcon('Due')}</span></th>
                    </tr>
                </thead>
                <tbody>
                {this.renderItemList(items)}
                </tbody>
            </table>
        );
    }

    renderModelList(models){
        let sorter = this.getModelSortFunction();
        let returned = models.sort(sorter).map(model => {
            return <ReportCheckedOutModel key={model.address + model.quantity} model={model}/>;
        });
        if(this.state.modelReversed) returned.reverse();
        return returned;
    }

    renderModels(models) {
        if(models.length === 0) return <p>No non-serialized items checked out</p>;
        return (
            <table className="checked-out-items-report-table">
                <thead>
                    <tr>
                        <th className="report-table-header" id="Name" onClick={this.changeModelSort.bind(this)}>Model Name<span>{this.renderModelIcon('Name')}</span></th>
                        <th>Address</th>
                        <th>Quantity</th>
                        <th>Checked Out To</th>
                        <th className="report-table-header" id="Due" onClick={this.changeModelSort.bind(this)}>Due On<span>{this.renderModelIcon('Due')}</span></th>
                    </tr>
                </thead>
                <tbody>
                {this.renderModelList(models)}
                </tbody>
            </table>
        );
    }

    renderItemIcon(header){
        if(header !== this.state.sortItemBy) return <img id={header} height='10' width='10' src="../assets/images/both-arrows.png" />;
        else if(this.state.itemReversed) return <img id={header} height='10' width='10' src="../assets/images/up-arrow.png" />;
        else return <img id={header} height='10' width='10' src="../assets/images/down-arrow.png" />;
    }

    renderModelIcon(header){
        if(header !== this.state.sortModelBy) return <img id={header} height='10' width='10' src="../assets/images/both-arrows.png" />;
        else if(this.state.modelReversed) return <img id={header} height='10' width='10' src="../assets/images/up-arrow.png" />;
        else return <img id={header} height='10' width='10' src="../assets/images/down-arrow.png" />;
    }

    render() {
        if(this.state.loading) return <img src='../assets/images/loading.gif' />;
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
