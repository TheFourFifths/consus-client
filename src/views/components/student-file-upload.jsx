import React from 'react';
import { submitStudentList } from '../../lib/api-client';

export default class StudentFileUpload extends React.Component {

    changeFile(e) {

    }

    submit(e) {
        e.preventDefault();
    }

    render() {
        return (
            <div className='file-upload-form'>
              <form ref='uploadForm' onSubmit={this.submit.bind(this)}'>
                <input type='file' onChange={this.changeFile.bind(this)}></input>
                <input type='submit'></input>
              </form>
            </div>
        );
    }

}
