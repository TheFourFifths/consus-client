import React from 'react';

export default class Model extends React.Component {

    render() {
        if (this.props.model === null) {
            return <i>No model found</i>;
        }
        return (
            <div className='model'>
                Model ID: {this.props.model.id}
                <br />
                Model name: {this.props.model.name}
            </div>
        );
    }

}
