import { render } from 'react-dom';
import { IndexRoute, Router, Route, browserHistory } from 'react-router';
import Root from './layout/root';
import Main from './pages/main';
import './styles/main.scss';

const app = (
    <Router history={ browserHistory }>
        <Route path="/" component={ Root }>
            <IndexRoute component={ Main }/>
        </Route>
    </Router>
);

render(
    app,
    document.getElementById('app')
);
