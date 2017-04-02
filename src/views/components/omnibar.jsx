import React from 'react';
import { readAddress } from 'consus-core/identifiers';
import OmnibarController from '../../controllers/components/omnibar';
import ModelController from '../../controllers/pages/model';
import ConfirmModal from './confirm-modal.jsx';
import InputModal from "../components/input-modal.jsx";
import StudentController from '../../controllers/pages/student'
export default class Omnibar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            query: '',
            confirmExit: false,
            showIdInputModal: false,
            rfid: null
        };
    }

    changeQuery(e) {
        let regex = new RegExp("^[a-zA-Z0-9]*$");
        let regexOnlyNums = new RegExp("^[0-9]*$");
        let rfid = e.target.value;
        if(regex.test(rfid)) {
            if (e.target.value.length === 6 && regexOnlyNums.test(rfid)) {
                this.setState({
                    query: ''
                });
                if(OmnibarController.getWarning()){
                    this.setState({confirmExit: true, next: "student", studentID: rfid});
                }else{
                    OmnibarController.getStudent(rfid).catch(e => {
                        if (e === 'The student could not be found.' ) {
                            this.setState({
                                showIdInputModal: true,
                                rfid: rfid
                            })
                        }
                    });
                }
            } else {
                try {
                    let result = readAddress(e.target.value);
                    this.setState({
                        query: ''
                    });
                    if(result.type === 'model') {
                        ModelController.getModelAndItems(e.target.value);
                    } else if (result.type === 'item') {
                        OmnibarController.displayItem(e.target.value);
                    }
                } catch (f) {
                    this.setState({
                        query: e.target.value
                    });
                }
            }
        }else{
            OmnibarController.throwInvalidCharacterError();
        }
    }

    clickLogo() {
        if(OmnibarController.emptyCart()){
            if (OmnibarController.getWarning()){
                this.setState({confirmExit: true, next:"home"});
            }
            else {
                OmnibarController.leavePage('/');
            }
        }
    }

    handleConfirmModal(bool){
        this.setState({confirmExit: false});
        if(bool) {
            switch(this.state.next){
                case "student":
                    OmnibarController.getStudent(this.state.studentID);
                    break;
                case "home":
                    OmnibarController.leavePage('/');
                default:
                    OmnibarController.leavePage('/');
            }
        }
    }
    associateRfidToStudent(id){
        this.closeRfidInputmodal();
        StudentController.studentToRfid(id, this.state.rfid);
    }

    closeRfidInputmodal(){
        this.setState({
            showIdInputModal: false,
            rfid: null
        })
    }
    render() {
        return (
            <div id='omnibar' className='no-print'>
              <ConfirmModal
                  message="Are you sure you wish to leave the page? Unsaved changes will be lost."
                  active = {this.state.confirmExit}
                  onSelect = {bool => this.handleConfirmModal(bool)}
              />
                <InputModal
                    message="The rfid that was scanned could not be found. Please enter the student's ID number and we will try to associate the student and rfid"
                    active={this.state.showIdInputModal}
                    onAccept={this.associateRfidToStudent.bind(this)}
                    onCancel={this.closeRfidInputmodal.bind(this)}
                    acceptText='Associate student and rfid'
                    textHidden={false}
                />
              <img onClick={this.clickLogo.bind(this)} src='../assets/icons/consus-logo.png'/>
              <input maxLength='30' type='text' onChange={this.changeQuery.bind(this)} value={this.state.query} placeholder='Search' autoFocus/>
            </div>
        );
    }
}
