import React from 'react';

import { Link } from 'react-router';
import { searchStudent } from '../../lib/api-client'

export default class Omnibar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            query: ''
        };
    }

    changeQuery(e) {
        if(e.target.value.length === 6) {
            this.setState({
                query: ''
            });
            searchStudent(e.target.value);
        } else {
            this.setState({
                query: e.target.value
            });
        }
    }

    render() {
        return (
            <div id='omnibar'>
                <Link to='/'>
                  <img src='../assets/icons/consus-logo.png'></img>
                </Link>
                <input type='text' onChange={this.changeQuery.bind(this)} value={this.state.query} placeholder='Search' autoFocus/>
            </div>
        );
    }

}
