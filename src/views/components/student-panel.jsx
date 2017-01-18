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

        let modelCounts = [];
        this.props.student.models.forEach(model => {
            let exists = false;
            modelCounts.forEach(mc => {
                if(model.address === mc.address && !exists){
                    mc.quantity++;
                    exists = true;
                }
            });
            if(!exists){
                modelCounts.push({address: model.address, name: model.name, quantity: 1});
            }
        });

        return (
            <div>
                {this.props.student.items.map((item, i) => {
                    return (<Link to={`/item/${item.address}`}  key={i} className={item.timestamp < Math.floor(Date.now()/1000) ? 'link-nostyle overdue' : 'link-nostyle'}>
                        <div className="item-info">
                            {this.renderItemInfo(item)}
                        </div>
                    </Link>);
                })}

                {modelCounts.map((model, m) => {
                    return (<Link to={`/model/${model.address}`} key={m} className={model.timestamp < Math.floor(Date.now()/1000) ? 'link-nostyle overdue' : 'link-nostyle'}>
                        <div className="item-info">
                            {this.renderModelInfo(model)}
                        </div>
                    </Link>);
                })}
            </div>
        );
    }

    renderModelInfo(model){
        return (<div>{model.name} <i>{model.address}</i> ({model.quantity})</div>);
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
