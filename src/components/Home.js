import React from 'react';
import { Link } from 'react-router-dom';


class Home extends React.Component {
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
            <li> Mcginnis Family </li>
            <li> Jordyns Game </li>
          </ul>
        </div>
      </div>
    )
  }
}

export default Home;