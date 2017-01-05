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
        let reader =  new FileReader;
        reader.onload = function(e) {
            let data = reader.result;
            console.log(data);
            StudentFileUploadFormController.uploadStudents(data);
        };
        e.preventDefault();
        console.log(this.state.file);
        reader.readAsDataURL(this.state.file);

    }
    render() {
        return(
            <div>
                <form onSubmit={this.submit.bind(this)}>
                To upload a file:
                    <input type="file" onChange={this.changeFile.bind(this)} />
                    <input type="submit" value="Submit" />
                </form>
            </div>
        );
    }

}
