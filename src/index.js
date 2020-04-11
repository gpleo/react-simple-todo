import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './index.css';
import App from './App';
import Todo from './todo/List';

ReactDOM.render(
  <Router>
    <Route path="/" component={App} exact />
    <Route path="/todo" component={Todo} />
  </Router>,
  document.getElementById('root')
);
