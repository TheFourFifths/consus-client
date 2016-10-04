import React from 'react';

export default class Item extends React.Component {

    render() {
        if (this.props.item === null) {
            return <i>No item found</i>;
        }
        return (
            <div className='item'>
                Item ID: {this.props.item.id}
                <br />
                Item status: {this.props.item.status}
            </div>
        );
    }

}
