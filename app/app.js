import { render } from 'react-dom';
import { IndexRoute, Router, Route, browserHistory } from 'react-router';
import Root from './layout/root';
import Main from './pages/main';
import Craft from './pages/craft';
import Player from './pages/player';
import './styles/main.scss';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import allReducers from './reduxStore/index';

import firebase from './reduxStore/middlewares/firebaseMiddleware';

const storeEnhancers = compose(
    applyMiddleware(
        firebase
    )
);

const store = window.store = createStore(allReducers, undefined, storeEnhancers);

const app = (
    <Provider store={ store }>
        <Router history={ browserHistory }>
            <Route path="/" component={ Root }>
                <IndexRoute component={ Craft }/>
            </Route>
            <Route path=":playerID" component={ Main } />
            <Route path=":playerID/player" component={ Player } />
        </Router>
    </Provider>
);

render(
    app,
    document.getElementById('app')
);
