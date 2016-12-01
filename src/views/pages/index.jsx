import React from 'react';
import { Link } from 'react-router';
import { getAllModels } from '../../lib/api-client';
import { getAllItems } from '../../lib/api-client';
import { getModelsForNewItem } from '../../lib/api-client';
export default class Index extends React.Component {

    allModels(e) {
        getAllModels();
    }

    allItems(){
        getAllItems();
    }
    newItem(e) {
      getModelsForNewItem();
    }

    render() {
        return (
            <div id='index'>
                <button onClick={this.allModels.bind(this)}>View all models</button>
                <button onClick={this.allItems.bind(this)}>View all Items</button>
                <div id='links'>
                  <button onClick={this.newItem.bind(this)}>Create a New Item</button><br/>
                  <Link to='/models/new'>Create a New Model</Link><br/>
                </div>
            </div>
        );
    }

}
