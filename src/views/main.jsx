'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import { changePort } from '../lib/api-client';
changePort(location.search.split('port=')[1]);

import App from './app.jsx';
import Index from './pages/index.jsx';
import Student from './pages/student.jsx';
import Students from './pages/students.jsx';
import Models from './pages/models.jsx';

import CreateModelForm from './components/create-model-form.jsx';
import CreateItemForm from './components/create-item-form.jsx';
import StudentFileUpload from './components/student-file-upload.jsx';
import EditModelForm from './components/edit-model-form.jsx';
import Items from './pages/items.jsx';
import Model from './components/model.jsx';
import ModelPage from './pages/model.jsx';
import Item from './pages/item.jsx';
import OverdueItems from './pages/overdue.jsx';
import Printer from './pages/printer.jsx';
import ReportPage from './pages/report.jsx';
import CreateStudentForm from './components/create-student-form.jsx';

ReactDOM.render((
    <Router history={hashHistory}>
        <Route path='/' component={App}>
            <IndexRoute component={Index} />
            <Route path='/student' component={Student} />
            <Route path='/models' component={Models} />
            <Route path='/models/new' component={CreateModelForm} />
            <Route path='/model/:address' component={Model}/>
            <Route path='/model' component={ModelPage}/>
            <Route path='/model/edit/:address' component={EditModelForm} />
            <Route path='/items' component={Items} />
            <Route path='/item/:address' component={Item}/>
            <Route path='/overdue' component={OverdueItems} />
            <Route path='/items/new' component={CreateItemForm} />
            <Route path='/students/upload' component={StudentFileUpload} />
            <Route path='/students' component={Students} />
            <Route path='/printer' component={Printer} />
            <Route path='/reports' component={ReportPage} />
            <Route path='/student/new' component={CreateStudentForm }/>
        </Route>
    </Router>
), document.getElementById('app-container'));
