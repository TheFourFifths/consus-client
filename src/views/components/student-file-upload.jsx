import React from 'react';
import StudentFileUploadFormController from '../../controllers/components/student-file-upload-form';
import FileInput from 'react-simple-file-input';
export default class StudentFileUpload extends React.Component {

    constructor(){
        super();
        this.state = {
            file: null
        };
    }

    changeFile(e) {
        StudentFileUploadFormController.submitFile(e.target.value);
    }

    submit(e) {
        e.preventDefault();
        StudentFileUploadFormController.submitFile();
    }
    handleFileSelected(event, file){
        console.log('test');
    }
    render() {
        return(
            <div>
                To upload a file:
                <FileInput
                    readAs='binary'
                    handleFileSelected= {this.handleFileSelected}>
                    Click Here
                </FileInput>
            </div>
        );
    }

}
