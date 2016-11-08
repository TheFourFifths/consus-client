import React from 'react';
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

    search(e) {
        e.preventDefault();
    }

    render() {
        return (
            <div id='omnibar'>
                <input type='text' onChange={this.changeQuery.bind(this)} value={this.state.query} placeholder='Student ID' autoFocus/>
                <input type='button' onClick={this.search.bind(this)} value='Search' />
            </div>
        );
    }

}
