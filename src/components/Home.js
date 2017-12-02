import React from 'react';
import { Link } from 'react-router-dom';
import { getGameList } from '../api/index.js'
import { firebasedb } from '../utils/config.js'

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gameList : [],
    }
    this.getGames = this.getGames.bind(this);
  }
  componentDidMount () {
    const gamesRef = firebasedb.ref('games');
    gamesRef.on('value', (snapshot) => {
      const games = snapshot.val();
      //console.log(games);
      let gameList = [];
      for(let item in games) {
        if(games[item].play === 'waiting'){
          gameList.push({
            id : item,
            gameName: games[item].name,
            selectedTheme: games[item].theme
          });
        }
      }
      this.setState({
        gameList
      });
    });
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
            {this.state.gameList.map(({ gameName, id, selectedTheme }) => (
              <Link to={`/game/${id}`} key={id}>
                <li> {gameName} </li>
              </Link>
            ))}
          </ul>
        </div>
      </div>
    )
  }
}

export default Home;