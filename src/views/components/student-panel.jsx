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
                    return <div key={i}>
                        {this.renderModelInfo(item)}
                        Item Code: {item.address}
                        <br/>
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
                Model: {model.name}
            </div>
        }
    }

    render() {
        return (
            <div className='student'>
                <p className='name'>{this.props.student.name}</p>
                <p className='id'>{this.props.student.id}</p>
                <h4>Equipment</h4>
                {this.renderEquipment()}
            </div>
        );
    }

}
