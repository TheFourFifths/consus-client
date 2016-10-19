import React from 'react';

export default class StudentPanel extends React.Component {

    renderEquipment() {
        if(this.props.student.itemAddresses.length === 0) {
            return <div><i>Student has no equipment checked out.</i></div>;
        }
        return (
            <ul>
                {this.props.student.itemAddresses.map((itemAddress, i) => {
                    return <li key={i}>{itemAddress}</li>;
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
