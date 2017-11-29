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
  grabTeamList (id) {
    this.setState(() => ({
      render: 'teamList',
    }))
    emojiPickerPlayer(id)
    setTimeout(()=> {

      this.getEmojiPicker()
    }, 4000)
  }
  getEmojiPicker () {
    const id = this.props.match.params.id;


    const team = this.state.playersTeam;
    const checkTurn1 = firebasedb.ref(`games/${id}/teams/${team}`);
    checkTurn1.on('value', (snapshot1) => {
      let items = snapshot1.val();
       for(let key in items){
        if(items[key].name === this.state.name && items[key].turn === 'playing'){
          this.setState(() => ({
            render: 'EmojiPicker'
          }))
        }
      }
    })
  /*
    const checkTurn = firebasedb.ref(`games/${id}/teams/${team}`).once('value').then((snapshot) => {
      this.setState(() => ({ render: 'EmojiGuesser'}))
      let items = snapshot.val();
       for(let key in items){
        if(items[key].name === this.state.name && items[key].turn === 'playing'){
          this.setState(() => ({
            render: 'EmojiPicker'
          }))
        }
      }
    }) */
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
          ? <EmojiPicker playersTeam={this.state.playersTeam} id={this.props.match.params.id}/>
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

