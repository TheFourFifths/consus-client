import React from 'react';
import ModelStore from '../../store/model-store';
import ListenerComponent from '../../lib/listener-component.jsx';

export default class Student extends ListenerComponent {
    render() {
        return (
            <div className='student'>
                <div className="titleArea">
                    <h2>{this.props.student.id}</h2>
                </div>
                <div className="infoArea">
                    <div className="descriptionArea">
                        {this.renderItems()}
                    </div>
                </div>
                <div className="actionArea">
                    <img src="../assets/images/add.svg"/>
                    <img src="../assets/images/edit.svg"/>
                    <img src="../assets/images/delete.svg"/>
                </div>
                <div className="clear"></div>
            </div>
        );
    }

    renderItems() {
        if(this.props.student.items.length === 0){
            return <div>This student has no items.</div>;
        }else{
            return this.props.student.items.map(item => {
                return (
                    <div key={item.address}>
                        {ModelStore.getModelByAddress(item.modelAddress).name}({item.modelAddress}){item.timestamp < Math.floor(Date.now()/1000) ? '(overdue)' : ''}
                    </div>
                );
            });
        }
    }

}
