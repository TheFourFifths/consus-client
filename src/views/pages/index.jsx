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
                <button onClick={this.allModels.bind(this)}>View all models</button>
            </div>
        );
    }

}
