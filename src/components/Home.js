import React from 'react';
import { Link } from 'react-router-dom';
import { getGameList } from '../api/index.js'

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gameList : {3296: {gameName : 'jordynnn', selectedTheme:'Elf'}}
    }
    this.getGames = this.getGames.bind(this);
  }
  componentDidMount () {
    this.getGames()
  }
  getGames () {
    const list = getGameList()
    this.setState(() => ({
      gameList : list
    }))
  }
  render () {
    return (
      <div className="Home">
        <header className="Home-header">
          <div className='top-titles'>
            <h1 className="Home-title">Emoji Game</h1>
            <Link to='/newGame' >
              <button className='home-new-game'>Create New Game</button>
            </Link>
          </div>
        </header>
        <div className="Home-intro">
          <ul className='home-game-list'>
            {Object.keys(this.state.gameList).map((key) => (
              <Link to={`/game/${key}`} key={key}>
                <li key={key}> {this.state.gameList[key]['gameName']} </li>
              </Link>
            ))})
          </ul>
        </div>
      </div>
    )
  }
}

export default Home;