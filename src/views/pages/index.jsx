import React from 'react';
import { Link } from 'react-router'
import { getAllModels } from '../../lib/api-client'
export default class Index extends React.Component {

    allModels(e) {
        getAllModels();
    }

    render() {
        return (
            <div id='index'>
                <div id='links'>
                  <button onClick={this.allModels.bind(this)}>View all models</button><br/>
                  <Link to='/items/new'>Create A New Item</Link><br/>
                  <Link to='/models/new'>Create a New Model</Link><br/>
                </div>
            </div>
        );
    }

}
