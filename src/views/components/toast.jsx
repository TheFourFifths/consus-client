import React from 'react';

export default class Toast extends React.Component {

    render() {
        return (
            <div className='toast'>
                {this.props.children}
            </div>
        );
    }

}
