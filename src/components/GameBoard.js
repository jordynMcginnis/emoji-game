import React from 'react';
import { saveUserName, getTeamList, emojiPickerPlayer, getEmoji } from '../api/index.js';
import EmojiPicker from './EmojiPicker.js'
import { firebasedb } from '../utils/config.js'

class GameBoard extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      name : '',
      teamList: '',
      render : 'name',
      playersTeam: '',
      currentEmoji: '',
      team1List: [1,2,3],
      team2List: [1,2,3],
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
  componentDidMount() {
  const id = this.props.match.params.id;
  const team1 = firebasedb.ref(`games/${id}/teams/team1`);
  team1.on('value', (snapshot) => {
    let items = snapshot.val();
    let newState = [];
    for (let item in items) {
      newState.push(
        items[item].name
      );
    }
     this.setState({
      team1List: newState
    });
  })
  const team2 = firebasedb.ref(`games/${id}/teams/team2`);
  team2.on('value', (snapshot) => {
    let items = snapshot.val();
    //console.log('second' + JSON.stringify(items["-L-4dyiNPLwzpRY0IE-W"].name));
    let newState = [];
    for (let item in items) {
      newState.push(
        items[item].name
      );
    }
     this.setState({
      team2List: newState
    });
  })
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
    console.log(this.state.teamList)
    setTimeout(()=> {
      this.setState(() => ({
        render: 'teamList',
      }))
      this.getEmojiPicker()
    }, 4000)
  }
  getEmojiPicker () {
    const id = this.props.match.params.id;
    /*
    setTimeout(() => {
      if(this.state.name === emojiPickerPlayer()){
        this.setState(() => ({ render : 'EmojiPicker'}))
      }else {
        this.setState(() => ({ render : 'EmojiGuesser'}));
        this.grabEmojis()
      }
    }, 4000) */
    emojiPickerPlayer(id)
  }
  grabEmojis () {
    this.setState(() => ({currentEmoji : getEmoji(this.state.playersTeam)}))
  }
  render () {
    const { render, teamList, currentEmoji, playersTeam } = this.state
    return (
      <div className='game-board-main'>
        {render === 'name'
          ? <div className='name-info-main'>
              <input onChange={this.handleName} placeholder='enter name' className='game-board-name-input'/>
              <button onClick={this.submitName} className='game-board-name-button'>submit</button>
            </div>
          : null
        }
        {render === 'loading' ? <div className='loading'></div> : null}
        {render === 'teamList'
          ? <div className= 'player-list-main'>
              <div className='team1'>
                <h2>Team 1:</h2>
                <ul>
                 {this.state.team1List.map((player) => {
                    return <li> {player}</li>
                  })}
                </ul>
              </div>
              <div className='team2'>
                <h2> Team 2:</h2>
                <ul>
                  {this.state.team2List.map((player) => {
                    return <li> {player}</li>
                  })}
                </ul>
              </div>
            </div>
          : null
        }
        { render ==='EmojiPicker'
          ? <EmojiPicker team={playersTeam}/>
          : null
        }
        {
          render === 'EmojiGuesser'
          ? <div>
              <h5>Guess the word!</h5>
              <h2>{currentEmoji}</h2>
              <h5>Shout out the word before the other team!</h5>
            </div>
          : null
        }
       </div>
    )
  }
}

export default GameBoard;

