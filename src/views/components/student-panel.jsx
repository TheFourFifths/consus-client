import React from 'react';
import { Link } from 'react-router';
import ModelStore from '../../store/model-store';
import ListenerComponent from '../../lib/listener-component.jsx';
import StudentPanelController from '../../controllers/components/student-panel';
import SavedEquipment from './saved-equipment.jsx';
import moment from 'moment-timezone';

export default class StudentPanel extends ListenerComponent {

    constructor() {
        super();
        this.state = {
            checkinNum: 1,
            models: ModelStore.getAllModels()
        }
    }

    componentWillMount(){
        StudentPanelController.getModels();
    }

    getStores() {
        return [
            ModelStore
        ];
    }

    getState() {
        return {
            models: ModelStore.getAllModels()
        }
    }

    changeCheckinNum(maxCheckin, e) {
        if(parseInt(e.target.value) < 1){
            this.setState({
                checkinNum: 1
            });
        } else if(parseInt(e.target.value) > maxCheckin) {
            this.setState({
                checkinNum: maxCheckin
            });
        } else {
            this.setState({
                checkinNum: e.target.value
            });
        }
    }

    checkInModel(studentId, modelAddress, quantity) {
        if(isNaN(parseInt(quantity))){
            StudentPanelController.throwNotANumberError();
        } else {
            this.props.checkInModel(studentId, modelAddress, quantity);
        }
        this.setState({
            checkinNum: 1
        });
    }

    renderEquipment() {
        let items = this.props.student.items.filter(item => item.status === 'CHECKED_OUT');
        let models = this.props.student.models.filter(model => model.status === 'CHECKED_OUT');
        if (items.length === 0 && models.length === 0) {
            return (<i className='equipment-none'>Student has no equipment checked out.</i>);
        }
        return (
            <div className='equipment'>
                {items.map(item => {
                    return (
                        <div className="item-info" key={item.address}>
                            <Link to={`/item/${item.address}`} className={item.timestamp < Math.floor(Date.now()/1000) ? 'link-nostyle overdue' : 'link-nostyle'}>
                                {this.renderItemInfo(item)}
                            </Link>
                            <div className='buttons'>
                                <button onClick={() => StudentPanelController.reserveItem(item.address)}>Save</button>
                            </div>
                        </div>
                    );
                })}
                {models.map(model => {
                    return (
                        <div className="model-info" key={model.address}>
                            <Link to={`/model/${model.address}`} className={model.timestamp < Math.floor(Date.now()/1000) ? 'link-nostyle overdue' : 'link-nostyle'}>
                                {this.renderModelInfo(model)}
                            </Link>
                            <div className='buttons'>
                                <input type='number' value={this.state.checkinNum} onChange={this.changeCheckinNum.bind(this, model.quantity)} min='1' max={model.quantity} />
                                <button id={model.address} onClick={() => this.checkInModel(this.props.student.id, model.address, parseInt(this.state.checkinNum))}>Check in</button>
                                <button id={`all${model.address}`}  onClick={() => this.checkInModel(this.props.student.id, model.address, model.quantity)}>Check in All</button>
                                <button onClick={() => StudentPanelController.reserveModel(this.props.student.id, model.address)}>Save</button>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }

    renderModelInfo(model) {
        return (
            <span>
                {model.name} <i>{model.address}</i> ({model.quantity})
            </span>
        );
    }

    renderItemInfo(item) {
        let model = this.state.models.find(model => model.address === item.modelAddress);
        if (!model) {
            return null;
        } else {
            let dueDate = moment.tz(item.timestamp * 1000, 'America/Chicago');
            return (
                <div>
                    {model.name} {item.timestamp < Math.floor(Date.now()/1000) ? '(overdue)' : ''} <i>{item.address} Due on: {dueDate.format('MMMM Do YYYY, h:mm:ss a')}</i>
                </div>
            );
        }
    }

    render() {
        let savedItems = this.props.student.items.filter(item => item.status === 'SAVED');
        let savedModels = this.props.student.models.filter(model => model.status === 'SAVED');
        return (
            <div className='student'>
                <h2 className='name'>{this.props.student.name}</h2>
                <i className='id'>{this.props.student.id}</i>
                <h4 className='equipment-heading'>Equipment</h4>
                {this.renderEquipment()}
                <SavedEquipment items={savedItems} models={savedModels} />
            </div>
        );
    }

}
