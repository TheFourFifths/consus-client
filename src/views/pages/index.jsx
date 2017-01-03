import React from 'react';
import IndexController from '../../controllers/pages/index';

export default class Index extends React.Component {

    render() {
        return (
            <div id='index'>
                <div id='links'>
                  <button onClick={IndexController.getModels}>View all models</button><br/>
                  <button onClick={IndexController.getItems}>View all Items</button><br/>
                  <button onClick={IndexController.getOverdueItems}>Overdue Items</button><br/>
                </div>
            </div>
        );
    }

}
