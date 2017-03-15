import React from 'react';
import OmnibarController from '../../controllers/components/omnibar';
import { Link } from 'react-router';

export default class Omnibar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            query: ''
        };
    }

    changeQuery(e) {
        let regex = new RegExp("^[a-zA-Z0-9]*$");
        if(regex.test(e.target.value)) {
            if (e.target.value.length === 6) {
                this.setState({
                    query: ''
                });
                OmnibarController.getStudent(e.target.value);
            } else {
                this.setState({
                    query: e.target.value
                });
            }
        }else{
            OmnibarController.throwInvalidCharacterError();
        }
    }

    render() {
        return (
            <div id='omnibar' className='no-print'>
                <img id='logo' onClick={OmnibarController.navigateToIndex} src='../assets/icons/consus-logo.png'/>
                <input maxLength='30' type='text' onChange={this.changeQuery.bind(this)} value={this.state.query} placeholder='Search' autoFocus/>
            </div>
        );
    }
}
