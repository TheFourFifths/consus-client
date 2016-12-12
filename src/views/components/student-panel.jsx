import React from 'react';
import ModelStore from '../../store/model-store';
import ListenerComponent from '../../lib/listener-component.jsx';
import { justGetAllModels } from '../../lib/api-client';

export default class StudentPanel extends ListenerComponent {

    componentWillMount(){
        justGetAllModels();
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
        if(this.props.student.items.length === 0) {
            return <div><i>Student has no equipment checked out.</i></div>;
        }
        return (
            <div>
                {this.props.student.items.map((item, i) => {
                    return <div className="item-info" key={i}>
                        {this.renderModelInfo(item)}
                    </div>;
                })}
            </div>
        );
    }

    renderModelInfo(item){
        let model = this.state.models.find(model => model.address === item.modelAddress);
        if(!model){
            return null;
        }else{
            return <div>
                {model.name} <i>{item.address}</i>
            </div>
        }
    }

    render() {
        return (
            <div className='student'>
                <h2 className='name center'>{this.props.student.name}</h2>
                <i className='id center'>{this.props.student.id}</i>
                <h4>Equipment</h4>
                {this.renderEquipment()}
            </div>
        );
    }

}
