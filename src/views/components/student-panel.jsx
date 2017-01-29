import React from 'react';
import { Link } from 'react-router';
import ModelStore from '../../store/model-store';
import ListenerComponent from '../../lib/listener-component.jsx';
import StudentPanelController from '../../controllers/components/student-panel';
import Moment from 'moment-timezone';
import DateModal from '../components/date-modal.jsx';

export default class StudentPanel extends ListenerComponent {

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
    renderDueDate(item){
       let timeString = Moment.tz(item.timestamp * 1000, 'America/Chicago').format('MMMM Do YYYY, h:mm:ss a')

        return (
            <div>Due date: {timeString}</div>
        )

    }
    showDateModal(){
        this.setState({
            showDateModal: true
        });
    }

    changeDueDate(date, item){
        this.setState({
            showDateModal: false
        });
        StudentPanelController.changeDueDate(date, item);
    }
    renderEquipment() {
        if(this.props.student.items.length === 0) {
            return <i className='equipment-none'>Student has no equipment checked out.</i>;
        }

        return (
            <div className='equipment'>
                {this.props.student.items.map((item, i) => {
                    return <div className="item-info"  key={i}>
                        <DateModal
                            message='Select new due date'
                            active={this.state.showDateModal}
                            onDateSelected={date => this.changeDueDate(date, item)}
                        />
                        <Link to={`/item/${item.address}`} className={item.timestamp < Math.floor(Date.now()/1000) ? 'link-nostyle overdue' : 'link-nostyle'}>
                            {this.renderItemInfo(item)}
                        </Link>
                        <div title="Click to change due date" onClick={this.showDateModal.bind(this, item)}>{this.renderDueDate(item)}</div>
                        </div>
                })}
            </div>
        );
    }

    renderItemInfo(item){
        let model = this.state.models.find(model => model.address === item.modelAddress);
        if(!model){
            return null;
        }else{
            return <div>
                {model.name} {item.timestamp < Math.floor(Date.now()/1000) ? '(overdue)' : ''} <i>{item.address}</i>
            </div>
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
