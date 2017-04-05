import React from 'react';
import { Link } from 'react-router';
import ModelStore from '../../store/model-store';
import OmnibarController from '../../controllers/components/omnibar';

export default class SavedEquipment extends React.Component {

    displayItem(address){
        OmnibarController.displayItem(address);
    }

    renderItemInfo(item) {
        let model = ModelStore.getModelByAddress(item.modelAddress);
        if (!model) {
            return null;
        }
        return (
            <span>
                {model.name} {item.timestamp < Math.floor(Date.now()/1000) ? '(overdue)' : ''} <i>{item.address}</i>
            </span>
        );
    }

    renderModelInfo(model) {
        return (
            <span>
                {model.name} <i>{model.address}</i> ({model.quantity})
            </span>
        );
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
                            <div onClick={this.displayItem.bind(this, item.address)} className={item.timestamp < Math.floor(Date.now()/1000) ? 'link-nostyle overdue' : 'link-nostyle'}>
                                {this.renderItemInfo(item)}
                            </div>
                        </div>
                    );
                })}
                {this.props.models.map(model => {
                    return (
                        <div key={model.address} className="model-info">
                            <Link to={`/model/${model.address}`} className={model.timestamp < Math.floor(Date.now()/1000) ? 'link-nostyle overdue' : 'link-nostyle'}>
                                {this.renderModelInfo(model)}
                            </Link>
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
