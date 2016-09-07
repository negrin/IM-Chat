// import React from 'react';
import { render } from 'react-dom';
import { Router, Route, Redirect, hashHistory } from 'react-router';
import Layout from './layout/layout';
import LoginPage from './pages/login';

const app = (
    <Router history={ hashHistory }>
        <Redirect from="/" to="/login"/>
        <Route path="/" component={ Layout }>
            <Route path="login" component={ LoginPage }/>
        </Route>
    </Router>
);

render(
    app,
    document.getElementById('app')
);
