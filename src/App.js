import React, { Component } from 'react';
import './App.css';
import Home from './components/Home.js';
import ReactRouter, { Route, BrowserRouter as Router } from 'react-router-dom';
import NewGame from './components/NewGame.js';
import GameBoard from './components/GameBoard';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="Home">
          <Route exact path='/' component={Home}/>
          <Route path='/newGame' component={NewGame}/>
          <Route path='/game/:id' component={GameBoard} />
        </div>
      </Router>
    );
  }
}

export default App;
