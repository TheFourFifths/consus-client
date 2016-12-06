'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';

import App from './app.jsx';
import Index from './pages/index.jsx';
import Student from './pages/student.jsx';
import Models from './pages/models.jsx';

import CreateModelForm from './components/create-model-form.jsx';
import CreateItemForm from './components/create-item-form.jsx';
import StudentFileUpload from './components/student-file-upload.jsx';
import Items from './pages/items.jsx';
import Model from './components/model.jsx';
ReactDOM.render((
    <Router history={hashHistory}>
        <Route path='/' component={App}>
            <IndexRoute component={Index} />
            <Route path='/student' component={Student} />
            <Route path='/models' component={Model} />
            <Route path='/models/new' component={CreateModelForm} />
            <Route path="/model/:address" component={Model}/>
            <Route path='/items' component={Items} />
            <Route path='/items/new' component={CreateItemForm} />
	    <Route path='/students/upload' component={StudentFileUpload} />
        </Route>
    </Router>
), document.getElementById('app-container'));
