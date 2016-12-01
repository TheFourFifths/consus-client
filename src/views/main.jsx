'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';

import App from './app.jsx';
import Index from './pages/index.jsx';
import Student from './pages/student.jsx';
import Models from "./pages/models.jsx";
import createModelForm from './components/create-model-form.jsx';
import createItemForm from './components/create-item-form.jsx';
import Items from './pages/items.jsx';
import Model from './components/model.jsx';
ReactDOM.render((
    <Router history={hashHistory}>
        <Route path='/' component={App}>
            <IndexRoute component={Index} />
            <Route path='/student' component={Student} />
            <Route path='/models' component={Models} />
            <Route path='/models/new' component={createModelForm} />
            <Route path="/model/:address" component={Model}/>
            <Route path='/items' component={Items} />
            <Route path='/items/new' component={createItemForm} />
        </Route>
    </Router>
), document.getElementById('app-container'));
