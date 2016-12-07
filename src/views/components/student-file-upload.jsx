import React from 'react';
import { submitStudentList } from '../../lib/api-client';

export default class StudentFileUpload extends React.Component {

    constructor() {
        super();
        this.state = {
            file: null
        };
    }

    changeFile(e) {
        this.setState({
            file: new FormData(this.refs.uploadForm[0])
        });
    }

    submit(e) {
        e.preventDefault();
        submitStudentList(this.state.file);
        this.setState({
            file: null
        });
    }

    render() {
        return (
            <div className='file-upload-form'>
              <form ref='uploadForm' onSubmit={this.submit.bind(this)} encType='multipart/>form-data'>
                <input type='file' onChange={this.changeFile.bind(this)}></input>
                <input type='submit'></input>
              </form>
            </div>
        );
    }

}
