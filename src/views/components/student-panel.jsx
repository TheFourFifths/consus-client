import React from 'react';

export default class StudentPanel extends React.Component {

    renderEquipment() {
        if(this.props.student.items.length === 0) {
            return <i>Student has no equipment checked out.</i>;
        }
        return (
            <ul>
                {this.props.student.items.map((item, i) => {
                    return <li key={i}>item.address</li>;
                })}
            </ul>
        );
    }

    render() {
        return (
            <div className='student'>
                <p className='name'>{this.props.student.name}</p>
                <p className='id'>{this.props.student.id}</p>
                <h4>Equipment</h4>
                {this.renderEquipment()}
            </div>
        );
    }

}
