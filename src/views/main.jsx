'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';

import App from './app.jsx';
import Index from './pages/index.jsx';
import Student from './pages/student.jsx';
import Model from './pages/models.jsx';

import createItemForm from './components/create-item-form.jsx';

ReactDOM.render((
    <Router history={hashHistory}>
        <Route path='/' component={App}>
            <IndexRoute component={Index} />
            <Route path='/student' component={Student} />
            <Route path='/models' component={Model} />
            <Route path='/items/new' component={createItemForm} />
        </Route>
    </Router>
), document.getElementById('app-container'));
