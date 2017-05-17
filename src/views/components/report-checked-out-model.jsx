import React from 'react';
import StudentStore from '../../store/student-store';

export default class ReportCheckedOutModel extends React.Component {

    render() {
        let student = StudentStore.getStudentById(this.props.model.checkedOutTo);
        let dueDate = new Date(this.props.model.dueDate * 1000);
        return (
            <tr>
                <td className="centered">{this.props.model.name}</td>
                <td className="centered">{this.props.model.address}</td>
                <td className="centered">{this.props.model.quantity}</td>
                <td className="centered">{student.name}</td>
                <td className="centered">{dueDate.getMonth()+1}/{dueDate.getUTCDate()}/{dueDate.getFullYear()}</td>
            </tr>
        );
    }

}
