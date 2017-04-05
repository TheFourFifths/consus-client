import React from 'react';
import { readAddress } from 'consus-core/identifiers';
import OmnibarController from '../../controllers/components/omnibar';
import ModelPageController from '../../controllers/pages/model';
import { Link } from 'react-router';
import ConfirmModal from './confirm-modal.jsx';

export default class Omnibar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            query: '',
            confirmExit: false
        };
    }

    changeQuery(e) {
        let regex = new RegExp("^[a-zA-Z0-9]*$");
        let regexOnlyNums = new RegExp("^[0-9]*$");
        if(regex.test(e.target.value)) {
            if (e.target.value.length === 6 && regexOnlyNums.test(e.target.value)) {
                this.setState({
                    query: ''
                });
                if(OmnibarController.getWarning()){
                    this.setState({confirmExit: true, next: "student", studentID: e.target.value});
                }else{
                    OmnibarController.getStudent(e.target.value);
                }
            } else {
                try {
                    let result = readAddress(e.target.value);
                    this.setState({
                        query: ''
                    });
                    if(result.type === 'model') {
                        ModelPageController.getModelAndItems(e.target.value);
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

    render() {
        return (
            <div id='omnibar' className='no-print'>
                <ConfirmModal
                    message={`Are you sure you wish to leave the page?
                            Unsaved changes will be lost.`}
                    active = {this.state.confirmExit}
                    onSelect = {bool => this.handleConfirmModal(bool)}
                />
                <img onClick={this.clickLogo.bind(this)} src='../assets/icons/consus-logo.png'/>
                <input maxLength='30' type='text' onChange={this.changeQuery.bind(this)} value={this.state.query} placeholder='Search' autoFocus/>
            </div>
        );
    }
}
