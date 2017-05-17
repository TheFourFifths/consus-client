import React from 'react';
import ModelStore from '../../store/model-store';
import StudentStore from '../../store/student-store';

export default class ReportCheckedOutItem extends React.Component {

    render() {
        let model = ModelStore.getModelByAddress(this.props.item.modelAddress);
        let student = StudentStore.getStudentById(this.props.item.isCheckedOutTo);
        let dueDate = new Date(this.props.item.timestamp * 1000);
        return (
            <tr>
                <td className="centered">{model.name}</td>
                <td className="centered">{this.props.item.address}</td>
                <td className="centered">{student.name}</td>
                <td className="centered">{dueDate.getMonth()+1}/{dueDate.getUTCDate()}/{dueDate.getFullYear()}</td>
            </tr>
        );
    }

}
