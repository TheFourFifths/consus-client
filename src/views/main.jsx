'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';

import App from './app.jsx';
import Index from './pages/index.jsx';
import Student from './pages/student.jsx';

ReactDOM.render((
    <Router history={hashHistory}>
        <Route path='/' component={App}>
            <IndexRoute component={Index} />
            <Route path='/student' component={Student} />
        </Route>
    </Router>
), document.getElementById('app-container'));
