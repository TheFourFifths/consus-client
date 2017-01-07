import React from 'react';
import StudentFileUploadFormController from '../../controllers/components/student-file-upload-form';
export default class StudentFileUpload extends React.Component {

    constructor(){
        super();
        this.state = {
            file: null
        };
    }

    changeFile(e) {
        this.setState({
            file: e.target.files[0]
        });
    }

    submit(e) {
        e.preventDefault();
        StudentFileUploadFormController.uploadStudents(this.state.file);
    }
    render() {
        return(
            <div>
                <form onSubmit={this.submit.bind(this)}>
                To upload a file:
                    <input type="file" onChange={this.changeFile.bind(this)} accept=".xls,.xlsx, .xlsm" />
                    <input type="submit" value="Submit" />
                </form>
            </div>
        );
    }

}
