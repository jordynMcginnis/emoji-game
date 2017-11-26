import React from 'react';
import { saveUserName, getTeamList } from '../api/index.js';
import EmojiPicker from './EmojiPicker.js'

class GameBoard extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      name : '',
      teamList: {},
      render : 'EmojiPicker'
    }
    this.handleName = this.handleName.bind(this);
    this.submitName = this.submitName.bind(this);
    this.grabTeamList = this.grabTeamList.bind(this);
  }
  handleName ({ target }) {
    this.setState(() => ({
      name : target.value
    }))
  }
  submitName () {
    const id = this.props.match.params.id;

    saveUserName(id, this.state.name);
    this.setState(() => ({
      render : 'loading'
    }))
    this.grabTeamList(id);
  }
  grabTeamList (id) {
    setTimeout(()=> {
      this.setState(() => ({
        teamList : getTeamList(id),
        render: 'teamList'
      }))
    }, 4000)
  }
  render () {
    return (
      <div className='game-board-main'>
        {this.state.render === 'name'
          ? <div className='name-info-main'>
              <input onChange={this.handleName} placeholder='enter name' className='game-board-name-input'/>
               <button onClick={this.submitName} className='game-board-name-button'>submit</button>
            </div>
          : null
        }
        {this.state.render === 'loading' ? <div className='loading'></div> : null}
        {this.state.teamList.team2 !== undefined
          ? <div className= 'player-list-main'>
              <div className='team1'>
                <h2>Team 1:</h2>
                <ul>
                  {this.state.teamList.team1.map((player) => {
                    return <li> {player}</li>
                  })}
                </ul>
              </div>
              <div className='team2'>
                <h2> Team 2:</h2>
                <ul>
                  {this.state.teamList.team2.map((player) => {
                    return <li> {player}</li>
                  })}
                </ul>
              </div>
            </div>
          : null
        }
        { this.state.render ==='EmojiPicker'
          ? <EmojiPicker/>
          : null
        }
       </div>
    )
  }
}

export default GameBoard;

