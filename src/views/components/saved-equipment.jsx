import React from 'react';
import { Link } from 'react-router';
import ModelStore from '../../store/model-store';

export default class SavedEquipment extends React.Component {

    renderItemInfo(item){
        let model = ModelStore.getModelByAddress(item.modelAddress);
        return (
            <span>
                {model.name} {item.timestamp < Math.floor(Date.now()/1000) ? '(overdue)' : ''} <i>{item.address}</i>
            </span>
        );
    }

    renderEquipment() {
        if (this.props.items.length === 0 && this.props.models.length === 0) {
            return (<i className='equipment-none'>Student has no saved items.</i>);
        }
        return (
            <div className='equipment'>
                {this.props.items.map((item, i) => {
                    return (<Link to={`/item/${item.address}`}  key={i} className={item.timestamp < Math.floor(Date.now()/1000) ? 'link-nostyle overdue' : 'link-nostyle'}>
                        <div className="item-info">
                            {this.renderItemInfo(item)}
                        </div>
                    </Link>);
                })}
            </div>
        );
    }

    render() {
        return (
            <div className='saved-equipment'>
                <h4 className='equipment-heading'>Saved Equipment</h4>
                {this.renderEquipment()}
            </div>
        );
    }

}
