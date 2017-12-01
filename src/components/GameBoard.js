import React from 'react';
import { saveUserName, getTeamList, emojiPickerPlayer, getEmoji, finalCheck } from '../api/index.js';
import EmojiPicker from './EmojiPicker.js'
import { firebasedb } from '../utils/config.js'
import Themes from '../utils/themes.js'

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
      team1points: 0,
      team2points: 0,
      play: true,
      playerAmount: 0,

    }
    this.handleName = this.handleName.bind(this);
    this.submitName = this.submitName.bind(this);
    this.grabTeamList = this.grabTeamList.bind(this);
    this.getEmojiPicker = this.getEmojiPicker.bind(this);
    this.grabEmojis = this.grabEmojis.bind(this);
    this.checkEnd = this.checkEnd.bind(this);
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
        if(this.state.name === items[item].name){
          this.setState(() => ({
            playersTeam: 'team1'
          }))
        }
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
        if(this.state.name === items[item].name){
          this.setState(() => ({
            playersTeam: 'team2'
          }))
        }
      }
       this.setState({
        team2List: newState,
      });
    })
    const pointChecker = firebasedb.ref(`games/${id}/teamPoints/`);
    pointChecker.on('value', (points) => {
      const point2 = points.val().team2.point;
      const point1 = points.val().team1.point;

      this.setState(() => ({
        team1points: point1,
        team2points: point2
      }))

    })
    const stillPlaying = firebasedb.ref(`games/${id}/play`)
    stillPlaying.on('value', (status) => {
      const statusPlay = status.val()
      if(statusPlay === false){
        this.setState(() => ({render: false}))
      }
    })

    const playerAmount = firebasedb.ref(`games/${id}/teams/team1`);
    playerAmount.on('value', (snapshot) => {
      const items = snapshot.val();
      let count = 0;
      for(var key in items){
        count++;
      }
      const player2Amoutn = firebasedb.ref(`games/${id}/teams/team2`)
      .on('value', (snapshot1) => {
        const items2 = snapshot1.val();
        for(var key2 in items2){
          count++;
        }
      this.setState(() => {
        playerAmount : count
      })

      })
    })
  }

  submitName () {
    const id = this.props.match.params.id;

    saveUserName(id, this.state.name);
    this.setState(() => ({
      render : 'loading'
    }))
    setTimeout(() => {
      this.grabTeamList(id);
    }, 2000)
  }
  checkEnd() {
    if(finalCheck() === false){
      this.setState(() => ({
        render: finalCheck()
      }))
    }
  }
  grabTeamList (id) {
    this.setState(() => ({
      render: 'teamList',
    }))
    emojiPickerPlayer(id)
    console.log(emojiPickerPlayer(id));
    setTimeout(()=> {

      this.getEmojiPicker()
    }, 4000)
  }
  getEmojiPicker () {
    const id = this.props.match.params.id;


    const team = this.state.playersTeam;
    const checkTurn1 = firebasedb.ref(`games/${id}/teams/${team}`);
    checkTurn1.on('value', (snapshot1) => {
      this.setState(() => ({ render: 'EmojiGuesser'}))
      let items = snapshot1.val();
       for(let key in items){
        if(items[key].name === this.state.name && items[key].turn === 'playing'){
          this.setState(() => ({
            render: 'EmojiPicker'
          }))
        }
      }
    })
    this.grabEmojis(id);
  }
  grabEmojis (id) {
    console.log('this ran!')
    const team = this.state.playersTeam;
    //this.setState(() => ({currentEmoji : getEmoji(this.state.playersTeam)}))
    const getEmoji = firebasedb.ref(`games/${id}/teamEmoji/${team}/emoji`)
    getEmoji.on('value', (snapshot) => {
      const emoji = snapshot.val();
      this.setState(() => ({currentEmoji : emoji}));
    })
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
          ? <EmojiPicker playersTeam={this.state.playersTeam} id={this.props.match.params.id} check={this.checkEnd}/>
          : null
        }
        {
          render === 'EmojiGuesser'
          ? <div>

              <h5>Guess the word!</h5>
              <h2>{currentEmoji}</h2>
              <h5>Shout out the word before the other team!</h5>
              <h6> team 1: {this.state.team1points} </h6>
              <h6> team 2: {this.state.team2points}</h6>
            </div>
          : null
        }
        {
          render === false
          ? <div>
              <p>game over!</p>
              <p> team 1: {this.state.team1points }</p>
              <p>team 2: {this.state.team2points} </p>
            </div>
          : null
        }
       </div>
    )
  }
}

export default GameBoard;

