import React from 'react';

export default class StudentPanel extends React.Component {

    renderEquipment() {
        if(this.props.student.items.length === 0) {
            return <div><i>Student has no equipment checked out.</i></div>;
        }
        return (
            <div>
                {this.props.student.items.map((item, i) => {
                    return <div key={i}>
                        {item.address}
                        <br/>
                        {item.modelAddress}
                        <br/>
                        {item.status}
                        <br/>
                    </div>;
                })}
            </div>
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
