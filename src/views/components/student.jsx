import React from 'react';
import ModelStore from '../../store/model-store';
import StudentStore from '../../store/student-store';
import StudentController from '../../controllers/components/student';

export default class Student extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            editMode: false,
            student: StudentStore.getStudentById(props.studentId)
        };
    }

    toggleEditMode() {
        this.setState({editMode:!this.state.editMode})
    }

    saveChanges(){
        let updated = this.state.student;
        updated.name = this.refs.newStudentName.value.length === 0 ? this.state.student.name : this.refs.newStudentName.value;
        updated.major = this.refs.newStudentMajor.value.length === 0 ? this.state.student.major : this.refs.newStudentMajor.value;
        updated.email = this.refs.newStudentEmail.value.length === 0 ? this.state.student.email : this.refs.newStudentEmail.value;
        this.setState({
            editMode: false,
            student: updated
        });
        StudentController.UpdateStudent(updated);
    }

    render() {
        return (
            <div className='student'>
                <div className="titleArea">
                    <h2>{this.state.editMode ? <input id="nameArea" ref="newStudentName" placeholder= {this.state.student.name} /> : this.state.student.name}</h2>
                    <h3>{this.state.student.id}</h3>
                </div>
                <div className="infoArea">
                    <div className="editableInfo">
                        <span className="inline">
                            <h5>Major:</h5>
                            <span>{this.state.editMode ? <input id="majorArea" ref="newStudentMajor" placeholder= {this.state.student.major} /> : this.state.student.major}</span>
                        </span>
                        <span className="inline">
                            <h5>Email:</h5>
                            <span>{this.state.editMode ? <input id="emailArea" ref="newStudentEmail" placeholder= {this.state.student.email} /> : this.state.student.email}</span>
                        </span>
                        <span className="clear"></span>
                    </div>
                    <hr/>
                    <h5>Items: </h5>
                    <div className="descriptionArea">
                        {this.renderItems()}
                    </div>
                </div>
                <div className="actionArea">
                    <img src="../assets/images/edit.svg" onClick={this.toggleEditMode.bind(this)}/>
                </div>
                <div className="clear">{this.state.editMode ? <button onClick={this.saveChanges.bind(this)}>SAVE CHANGES</button> : null}</div>
            </div>
        );
    }

    renderItems() {
        if(this.state.student.items.length === 0){
            return <div>This student has no items.</div>;
        }else{
            return this.state.student.items.map(item => {
                return (
                    <div key={item.address}>
                        {ModelStore.getModelByAddress(item.modelAddress).name}({item.modelAddress}){item.timestamp < Math.floor(Date.now()/1000) ? '(overdue)' : ''}
                        <br/>
                        Item Address: {item.address}
                    </div>
                );
            });
        }
    }

}
