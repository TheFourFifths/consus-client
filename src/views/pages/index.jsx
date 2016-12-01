import React from 'react';
import { getAllModels } from '../../lib/api-client';
import { getAllItems } from '../../lib/api-client';
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
                <div id='links'>
                  <button onClick={this.allModels.bind(this)}>View all models</button><br/>
                  <button onClick={this.allItems.bind(this)}>View all Items</button><br/>
                </div>
            </div>
        );
    }

}
