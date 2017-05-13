import React from 'react';
import ListenerComponent from '../../lib/listener-component.jsx';

export default class ItemList extends ListenerComponent {

    render() {
        return (
            <div>
                {Object.keys(this.props.items).map((item) => {
                    return (
                        <div key={item}>
                            Item:{item}
                        </div>
                    );
                })}
            </div>
        );
    }

}
