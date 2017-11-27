import React from 'react';
import { saveUserName, getTeamList, emojiPickerPlayer, getEmoji } from '../api/index.js';
import EmojiPicker from './EmojiPicker.js'

class GameBoard extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      name : '',
      teamList: {},
      render : 'name',
      playersTeam: '',
      currentEmoji: ''
    }
    this.handleName = this.handleName.bind(this);
    this.submitName = this.submitName.bind(this);
    this.grabTeamList = this.grabTeamList.bind(this);
    this.getEmojiPicker = this.getEmojiPicker.bind(this);
    this.grabEmojis = this.grabEmojis.bind(this);
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
    let team = ''
    if(getTeamList(id)['team1'].indexOf(this.state.name) > -1){
      team = 'team1'
    } else {
      team = 'team2'
    }
    setTimeout(()=> {
      this.setState(() => ({
        teamList : getTeamList(id),
        render: 'teamList',
        playersTeam : team
      }))
      this.getEmojiPicker()
    }, 4000)
  }
  getEmojiPicker () {
    setTimeout(() => {
      if(this.state.name === emojiPickerPlayer()){
        this.setState(() => ({ render : 'EmojiPicker'}))
      }else {
        this.setState(() => ({ render : 'EmojiGuesser'}));
        this.grabEmojis()
      }
    }, 4000)
  }
  grabEmojis () {
    this.setState(() => ({currentEmoji : getEmoji(this.state.playersTeam)}))
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
        {this.state.render === 'teamList'
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
          ? <EmojiPicker team={this.state.playersTeam}/>
          : null
        }
        {
          this.state.render === 'EmojiGuesser'
          ? <div>
              <h5>Guess the word!</h5>
              <h2>{this.state.currentEmoji}</h2>
              <h5>Shout out the word before the other team!</h5>
            </div>
          : null
        }

       </div>
    )
  }
}

export default GameBoard;

