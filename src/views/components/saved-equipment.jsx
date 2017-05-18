import React from 'react';
import { Link } from 'react-router';
import ModelStore from '../../store/model-store';
import StudentPanelController from '../../controllers/components/student-panel';
import OmnibarController from '../../controllers/components/omnibar';

export default class SavedEquipment extends React.Component {

    displayEquipment(address) {
        OmnibarController.displayEquipment(address);
    }

    renderItemInfo(item) {
        let model = ModelStore.getModelByAddress(item.modelAddress);
        if (!model) {
            return null;
        }
        return (
            <span>
                <span className="name">{model.name}</span>
                <span className="addr">{model.address}</span>
                <span>{item.timestamp < Math.floor(Date.now()/1000) ? ' (overdue)' : ''}</span>
            </span>
        );
    }

    renderModelInfo(model) {
        return <span>
            <span className="quantity">({model.quantity}&times;) </span>
            <span className="name">{model.name}</span>
            <span className="addr">{model.address}</span>
        </span>;
    }

    renderEquipment() {
        if (this.props.items.length === 0 && this.props.models.length === 0) {
            return (<i className='saved-equipment-none'>Student has no saved items.</i>);
        }
        return (
            <div className='saved-equipment'>
                {this.props.items.map(item => {
                    return (
                        <div key={item.address} className="item-info">
                            <div onClick={this.displayEquipment.bind(this, item.address)} className={item.timestamp < Math.floor(Date.now()/1000) ? 'link-nostyle overdue' : 'link-nostyle'}>
                                {this.renderItemInfo(item)}
                            </div>
                            <div className='buttons'>
                                <button className="neat-secondary-button" onClick={() => StudentPanelController.retrieveItem(item.address)}>Retrieve</button>
                            </div>
                        </div>
                    );
                })}
                {this.props.models.map(model => {
                    return (
                        <div key={model.address} className="model-info">
                            <div onClick={this.displayEquipment.bind(this, model.address)} className={model.timestamp < Math.floor(Date.now()/1000) ? 'link-nostyle overdue' : 'link-nostyle'}>
                                {this.renderModelInfo(model)}
                            </div>
                            <div className='buttons'>
                                <button className="neat-secondary-button" onClick={() => StudentPanelController.retrieveModel(this.props.student.id, model.address)}>Retrieve</button>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }

    render() {
        return (
            <div className='saved-equipment'>
                {this.renderEquipment()}
            </div>
        );
    }

}
