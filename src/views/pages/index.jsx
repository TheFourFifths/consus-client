import React from 'react';
import { Link } from 'react-router';
import { getAllModels } from '../../lib/api-client';
import { getModelsForNewItem } from '../../lib/api-client';
export default class Index extends React.Component {

    allModels(e) {
        getAllModels();
    }

    newItem(e) {
      getModelsForNewItem();
    }

    render() {
        return (
            <div id='index'>
                <div id='links'>
                  <button onClick={this.allModels.bind(this)}>View all models</button><br/>
                  <button onClick={this.newItem.bind(this)}>Create a New Item</button><br/>
                  <Link to='/models/new'>Create a New Model</Link><br/>
                  <Link to='/students/upload'>Upload Student List</Link>
                </div>
            </div>
        );
    }

}
