import React from 'react';
import {readAddress} from 'consus-core/identifiers';
import OmnibarController from '../../controllers/components/omnibar';
import ModelPageController from '../../controllers/pages/model';
import ConfirmModal from './confirm-modal.jsx';
import InputModal from "../components/input-modal.jsx";
import StudentController from '../../controllers/pages/student';
export default class Omnibar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            query: '',
            confirmExit: false,
            showIdInputModal: false,
            rfid: null,
            showStudentRedirectConfirmation: false
        };
    }

    submitQuery(e) {
        if (e.key === 'Enter') {
            let queryIsRfid = new RegExp("^rfid:.*");
            let query = this.state.query;
            if (queryIsRfid.test(query)) {
                this.setState({
                    query: ''
                });
                let rfid = query.split(":")[1];
                if (OmnibarController.getWarning()) {
                    this.setState({confirmExit: true, next: "student", studentID: rfid});
                } else {
                    OmnibarController.getStudent(rfid).catch(e => {
                        if (e === 'The student could not be found.') {
                            this.setState({
                                showIdInputModal: true,
                                rfid: rfid
                            });
                        }
                    });
                }
            } else {
                try {
                    let result = readAddress(query);
                    this.setState({
                        query: ''
                    });
                    if (result.type === 'model') {
                        ModelPageController.getModelAndItems(query);
                    } else if (result.type === 'item') {
                        OmnibarController.displayItem(query);
                    }
                } catch (f) {
                    OmnibarController.throwQueryInvalidError();
                }
            }
        }

    }

    changeQuery(e) {
        this.setState({
            query: e.target.value
        });
    }

    clickLogo() {
        if (OmnibarController.emptyCart()) {
            if (OmnibarController.getWarning()) {
                this.setState({confirmExit: true, next: "home"});
            }
            else {
                OmnibarController.leavePage('/');
            }
l        }
    }

    handleConfirmModal(bool) {
        this.setState({confirmExit: false});
        if (bool) {
            switch (this.state.next) {
            case "student":
                OmnibarController.getStudent(this.state.studentID);
                break;
            case "home":
                OmnibarController.leavePage('/');
                break;
            default:
                OmnibarController.leavePage('/');
            }
        }
    }

    associateRfidToStudent(id) {
        this.closeRfidInputmodal();
        StudentController.studentToRfid(id, this.state.rfid).catch(() => {
            this.setState({
                showStudentRedirectConfirmation: true
            });
        });
    }

    closeRfidInputmodal() {
        this.setState({
            showIdInputModal: false,
            rfid: null
        });
    }
    handleStudentRedirectModal(bool){
        if(bool){
            OmnibarController.leavePage('/student/new');
        }
        this.setState({
            showStudentRedirectConfirmation: false
        });
    }
    render() {
        return (
            <div id='omnibar' className='no-print'>
                <ConfirmModal
                    message={`Are you sure you wish to leave the page?
                            Unsaved changes will be lost.`}
                    active = {this.state.confirmExit}
                    onSelect = {bool => this.handleConfirmModal(bool)}
                />
                <ConfirmModal
                    message="The student ID that was entered was not found. Would you like to create a profile for this ID?"
                    active = {this.state.showStudentRedirectConfirmation}
                    onSelect = {bool => this.handleStudentRedirectModal(bool)}
                />
                <InputModal
                    message="The rfid that was scanned could not be found. Please enter the student's ID number and we will try to associate the student and rfid"
                    active={this.state.showIdInputModal}
                    onAccept={this.associateRfidToStudent.bind(this)}
                    onCancel={this.closeRfidInputmodal.bind(this)}
                    acceptText='Associate student and rfid'
                    textHidden={false}
                />
                <img onClick={this.clickLogo.bind(this)} src='../assets/images/home.svg'/>
                <input maxLength='30' type='text' onKeyPress={this.submitQuery.bind(this)}
                       onChange={this.changeQuery.bind(this)} value={this.state.query} placeholder='Search' autoFocus/>
            </div>
        );
    }
}
