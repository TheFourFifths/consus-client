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
        console.log(e.target);
        this.state.file = e.target.value;
        console.log(this.state.file);
        let i = 0;
        for(i = 0; i < this.state.file.length; i++) {
            console.log(this.state.file[i]);
        }
    }

    submit(e) {
        e.preventDefault();
        StudentFileUploadFormController.submitFile();
    }

    render() {
        return (
            <div className='file-upload-form'>
              <form ref='uploadForm' onSubmit={this.submit.bind(this)}>
                <input type='file' onChange={this.changeFile.bind(this)} />
                <input type='submit' />
              </form>
            </div>
        );
    }

}
