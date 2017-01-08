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
                <h1>Upload students</h1>
                <p>Use this page to upload/update students from an excel file. The excel file should have the following
                    requirements in order for this upload to work correctly.</p>
                <ul>
                    <li>First row is a title of the document(This will be ignored)</li>
                    <li>Second row contains headers for each of the columns.</li>
                    <li>In the second row there must be columns with the names: "Student", "Status", "E-mail", "Major"</li>
                    <li>A student is considered "currently attending" if and only if the status is "C - Current"</li>
                    <li>The rows below the second row are treated as students.</li>
                </ul>
                <br />
                <form onSubmit={this.submit.bind(this)}>
                Select the file to upload/update students from:
                    <input type="file" onChange={this.changeFile.bind(this)} accept=".xls, .xlsx, .xlsm" />
                    <input type="submit" value="Submit" />
                </form>
            </div>
        );
    }

}
