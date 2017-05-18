import React from 'react';
import ModelStore from '../../store/model-store';
import ListenerComponent from '../../lib/listener-component.jsx';
import StudentPanelController from '../../controllers/components/student-panel';
import SavedEquipment from './saved-equipment.jsx';
import moment from 'moment-timezone';
import OmnibarController from "../../controllers/components/omnibar";
import DateModal from "../components/date-modal.jsx";
import config from 'config';

export default class StudentPanel extends ListenerComponent {

    constructor() {
        super();
        this.state = {
            checkinNum: 1,
            models: ModelStore.getAllModels(),
            showItemDateModal: false,
            showModelDateModal: false
        };
    }

    componentWillMount() {
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
        };
    }

    changeCheckinNum(maxCheckin, e) {
        if (parseInt(e.target.value) < 1) {
            this.setState({
                checkinNum: 1
            });
        } else if (parseInt(e.target.value) > maxCheckin) {
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
        if (isNaN(parseInt(quantity))) {
            StudentPanelController.throwNotANumberError();
        } else {
            this.props.checkInModel(studentId, modelAddress, quantity);
        }
        this.setState({
            checkinNum: 1
        });
    }

    displayItem(address) {
        OmnibarController.displayItem(address);
    }

    changeItemDueDate(date, item) {
        StudentPanelController.changeItemDueDate(date, item);
        this.setState({
            showItemDateModal: false
        });
    }

    changeModelDueDate(date, model) {
        throw new Error(`Model due dates not yet implemented. Changing due date to: ${date} for model: ${model.address}`);
    }

    renderEquipment() {
        let items =this.props.student.items.filter(item => item.status === 'CHECKED_OUT');
        let models = this.props.student.models.filter(model => model.status === 'CHECKED_OUT');
        if (items.length === 0 &&models.length === 0) {
            return (<i className='equipment-none'>Student has no equipment checked out.</i>);
        }
        return (
            <div className='equipment'>
                {items.map(item => {
                    return (
                        <div key={item.address}>
                            {this.renderItemInfo(item)}
                            <DateModal
                                message='Select a new due date.'
                                active={this.state.showItemDateModal}
                                onDateSelected={date => this.changeItemDueDate(date, item)}
                            />
                        </div>
                    );
                })}
                {models.map(model => {
                    return (
                        <div key={model.address}>
                            {this.renderModelInfo(model)}
                            <DateModal
                                message='Select a new due date'
                                active={this.state.showModelDateModal}
                                onDateSelected={date => this.changeModelDueDate(date, model)}
                            />
                        </div>
                    );
                })}
            </div>
        );
    }

    renderModelInfo(model) {
        let dueDate = moment.tz(model.dueDate * 1000, config.get('timezone'));
        return <div className="model-info" onClick={() => OmnibarController.displayEquipment(model.address)}>
            <span className="quantity">({model.quantity}&times;) </span>
            <span className="name">{model.name}</span>
            <span className="addr">{model.address}</span>
            <br/>
            <span className="dueDate">{dueDate.format(config.get('cart.due_date_format'))}</span>
            <br/>
            <span className="buttons">
                <input type='number' value={this.state.checkinNum} onChange={this.changeCheckinNum.bind(this, model.quantity)} min='1' max={model.quantity} />
                <button id={model.address} className="neat-secondary-button" onClick={() => this.checkInModel(this.props.student.id, model.address, parseInt(this.state.checkinNum))}>
                    Check in
                </button>
                <button id={`all${model.address}`} className="neat-secondary-button" onClick={() => this.checkInModel(this.props.student.id, model.address, model.quantity)}>
                    Check in All
                </button>
                <button className="neat-secondary-button" onClick={() => StudentPanelController.saveModel(this.props.student.id, model.address)}>
                    Save
                </button>
            </span>
        </div>;
    }

    showItemDateModal() {
        this.setState({
            showItemDateModal: true
        });
    }

    renderItemInfo(item) {
        let model = this.state.models.find(model => model.address === item.modelAddress);
        if (!model) {
            return null;
        } else {
            let dueDate = moment.tz(item.timestamp * 1000, config.get('timezone'));
            return <div className="item-info" onClick={() => OmnibarController.displayEquipment(item.address)}>
                <span className="name">{model.name}</span>
                <span className="addr">{item.address}</span>
                <br/>
                <span className="dueDate">{dueDate.format(config.get('cart.due_date_format'))}</span>
                <br/>
                <span className="buttons">
                    <button className="neat-secondary-button" onClick={this.showItemDateModal.bind(this)}>Change due date</button>
                    <button className="neat-secondary-button" onClick={() => StudentPanelController.saveItem(item.address)}>Save</button>
                </span>
            </div>;
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
                <h4 className='equipment-heading'>Saved Equipment</h4>
                <SavedEquipment items={savedItems} models={savedModels} student={this.props.student} />
            </div>
        );
    }

}
