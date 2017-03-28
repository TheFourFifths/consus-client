import React from 'react';
import { Link } from 'react-router';
import ModelStore from '../../store/model-store';
import ListenerComponent from '../../lib/listener-component.jsx';
import StudentPanelController from '../../controllers/components/student-panel';
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
        if(this.props.student.items.length === 0 && this.props.student.models.length === 0) {
            return (<i className='equipment-none'>Student has no equipment checked out.</i>);
        }

        let modelCounts = StudentPanelController.countDuplicateModels(this.props.student.models);

        return (
            <div className='equipment'>
                {this.props.student.items.map((item, i) => {
                    return (<Link to={`/item/${item.address}`}  key={i} className={item.timestamp < Math.floor(Date.now()/1000) ? 'link-nostyle overdue' : 'link-nostyle'}>
                        <div className="item-info">
                            {this.renderItemInfo(item)}
                        </div>
                    </Link>);
                })}

                {modelCounts.map((model, m) => {
                    return (
                        <div className="item-info" key={m}>
                            <Link to={`/model/${model.address}`} className={model.timestamp < Math.floor(Date.now()/1000) ? 'link-nostyle overdue' : 'link-nostyle'}>
                                {this.renderModelInfo(model)}
                            </Link>
                            {this.renderCheckinButtons(model)}
                        </div>);
                })}
            </div>
        );
    }

    renderModelInfo(model){
        return (<div>{model.name} <i>{model.address}</i> ({model.quantity})</div>);
    }

    renderCheckinButtons(model){
        return (
            <div className='checkin-buttons'>
                <input type='number'  value={this.state.checkinNum} onChange={this.changeCheckinNum.bind(this, model.quantity)} min='1' max={model.quantity} />
                <button id={model.address} onClick={() => this.checkInModel(this.props.student.id, model.address, parseInt(this.state.checkinNum))}>Check in</button>
                <button id={`all${model.address}`}  onClick={() => this.checkInModel(this.props.student.id, model.address, model.quantity)}>Check in All</button>
            </div>
        );
    }

    renderItemInfo(item){
        let model = this.state.models.find(model => model.address === item.modelAddress);
        if(!model){
            return null;
        }else{
            let dueDate = moment.tz(item.timestamp * 1000, 'America/Chicago');
            return (<div>
                {model.name} {item.timestamp < Math.floor(Date.now()/1000) ? '(overdue)' : ''} <i>{item.address} Due on: {dueDate.format('MMMM Do YYYY, h:mm:ss a')}</i>
            </div>)
        }
    }

    render() {
        return (
            <div className='student'>
                <h2 className='name'>{this.props.student.name}</h2>
                <i className='id'>{this.props.student.id}</i>
                <h4 className='equipment-heading'>Equipment</h4>
                {this.renderEquipment()}
            </div>
        );
    }

}
