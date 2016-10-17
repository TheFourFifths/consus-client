import React from 'react';

export default class Item extends React.Component {

    render() {
        if (this.props.student === null) {
            return <i>No student found</i>;
        }
        return (
            <div className='student'>
                Student ID: {this.props.student.id}
                <br />
                Name: {this.props.student.name}
            </div>
        );
    }

}
