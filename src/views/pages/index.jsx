import React from 'react';
import { Link } from 'react-router'
import { getAllModels } from '../../lib/api-client'
import { getAllItems } from '../../lib/api-client'
export default class Index extends React.Component {

    allModels(e) {
        getAllModels();
    }

    allItems(){
        getAllItems();
    }
    render() {
        return (
            <div id='index'>
                <button onClick={this.allModels.bind(this)}>View all models</button>
                <p></p>
                <button onClick={this.allItems.bind(this)}>View all Items</button>
            </div>
        );
    }

}
