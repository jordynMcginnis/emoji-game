import React, { Component } from 'react';
import './App.css';
import Home from './components/Home.js';
import ReactRouter, { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import NewGame from './components/NewGame.js';
class App extends Component {
  render() {
    return (
      <div className="Home">
        <Router>
          <Switch>
            <Route exact path='/' component={Home}/>
            <Route exact path='/newGame' component={NewGame}/>
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
