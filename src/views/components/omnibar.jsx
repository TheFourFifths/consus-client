import React from 'react';
import { readAddress } from 'consus-core/identifiers';
import OmnibarController from '../../controllers/components/omnibar';
import ModelController from '../../controllers/pages/model';
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
        let regexOnlyNums = new RegExp("^[0-9]*$");
        if(regex.test(e.target.value)) {
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
                if (e.target.value.length === 6 && regexOnlyNums.test(e.target.value)) {
                    this.setState({
                        query: ''
                    });
                    OmnibarController.getStudent(e.target.value);
                } else {
                    this.setState({
                        query: e.target.value
                    });
                }
            }
        }else{
            OmnibarController.throwInvalidCharacterError();
        }
    }

    render() {
        return (
            <div id='omnibar' className='no-print'>
                <Link to='/'>
                  <img src='../assets/icons/consus-logo.png'/>
                </Link>
                <input maxLength='30' type='text' onChange={this.changeQuery.bind(this)} value={this.state.query} placeholder='Search' autoFocus/>
            </div>
        );
    }
}
