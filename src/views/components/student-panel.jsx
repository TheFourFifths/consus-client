import React from 'react';
import { Link } from 'react-router';
import ModelStore from '../../store/model-store';
import ListenerComponent from '../../lib/listener-component.jsx';
import StudentPanelController from '../../controllers/components/student-panel';

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
                <button onClick={() => this.props.checkInModel(this.props.student.id, model.address, model.quantity)}>Check in All</button>
            </div>
        );
    }

    renderItemInfo(item){
        let model = this.state.models.find(model => model.address === item.modelAddress);
        if(!model){
            return null;
        }else{
            return (<div>
                {model.name} {item.timestamp < Math.floor(Date.now()/1000) ? '(overdue)' : ''} <i>{item.address}</i>
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
