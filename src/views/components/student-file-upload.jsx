import React from 'react';
import { submitStudentList } from '../../lib/api-client';

export default class StudentFileUpload extends React.Component {

    constructor() {
        super();
        this.state = {
            file: null
        }
    }

    changeFile(e) {
        this.setState({
            file: e.target.value
        });
    }

    submit(e) {
        e.preventDefault();
        console.log(this.state.file)
    }

    render() {
        return (
            <div className='file-upload-form'>
              <form onSubmit={this.submit.bind(this)}>
                <input type='file' onChange={this.changeFile.bind(this)}></input>
                <input type='submit'></input>
              </form>
            </div>
        );
    }

}
