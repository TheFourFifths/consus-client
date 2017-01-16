import React from 'react';
import { Link } from 'react-router';
import IndexController from '../../controllers/pages/index';

export default class Index extends React.Component {

    render() {
        return (
            <div id='index'>
                <div id='links'>
                  <button onClick={IndexController.getModels}>View all models</button><br/>
                  <button id='view-items' onClick={IndexController.getItems}>View all items</button><br/>
                  <Link to='/students/upload'>Upload Student List</Link>
                </div>
            </div>
        );
    }

}
