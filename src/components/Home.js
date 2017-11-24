import React from 'react';

class Home extends React.Component {
  render () {
    return (
      <div className="Home">
        <header className="Home-header">
          <h1 className="Home-title">Emoji Game</h1>
        </header>
        <div className="Home-intro">
          <Home/>
        </div>
      </div>
    )
  }
}

export default Home;