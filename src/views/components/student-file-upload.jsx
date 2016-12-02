import React from 'react';
import { submitStudentList } from '../../lib/api-client';
import Modal from './modal.jsx';

export default class StudentFileUpload extends React.Component {

    constructor() {
        super();
        this.state = {
            file: null,
            active: false
        };
    }

    changeFile(e) {
        this.setState({
            file: e.target.files[0]
        });
    }

    submit(e) {
        e.preventDefault();
        submitStudentList(this.state.file);
        this.setState({
          file: null,
          active: true
        });
    }

    closeModal() {
        this.setState({
            file: null,
            active: false
        });
    }

    render() {
        return (
            <div className='file-upload-form'>
              <Modal active={this.state.active} onClose={this.closeModal.bind(this)} >File Uploaded.<br/></Modal>
              <form onSubmit={this.submit.bind(this)}>
                <input type='file' onChange={this.changeFile.bind(this)}></input>
                <input type='submit'></input>
              </form>
            </div>
        );
    }

}
