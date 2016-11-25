import React from 'react';

import { Link } from 'react-router';
import { searchStudent } from '../../lib/api-client';
import { Dispatcher } from 'consus-core/flux';

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
                searchStudent(e.target.value);
            } else {
                this.setState({
                    query: e.target.value
                });
            }
        }else{
            Dispatcher.handleAction('ERROR', {
                error: "Please only enter Alphanumeric Characters."
            });
        }
    }

    render() {
        return (
            <div id='omnibar'>
                <Link to='/'>
                  <img src='../assets/icons/consus-logo.png'></img>
                </Link>
                <input maxLength='30' type='text' onChange={this.changeQuery.bind(this)} value={this.state.query} placeholder='Search' autoFocus/>
            </div>
        );
    }
}
