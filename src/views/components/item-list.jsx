import React from 'react';
import ListenerComponent from '../../lib/listener-component.jsx';
import ModelStore from '../../store/model-store';

export default class ItemList extends ListenerComponent {

    render() {
        return (
            <div className="item-list">
                {Object.keys(this.props.items).map((item) => {
                    return (
                        <div key={item}>
                            {ModelStore.getModelByAddress(this.props.items[item].modelAddress).name}: ({item})
                        </div>
                    );
                })}
            </div>
        );
    }

}
