import React from 'react';
import { emojiWord, postEmoji, addPoint, getTheme, themeInfo, endGame } from '../api/index.js';
import Themes from '../utils/themes.js';
import { firebasedb } from '../utils/config.js'
class EmojiPicker extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      emojiWord: '',
      emoji: '',
      render: 'submit',
      playersTeam: '',
      theme: [],
      active: 0,
      past: [1],
      playersAmount: 0,
      count : 0
    }
    this.handleChange = this.handleChange.bind(this);
    //this.handleTeam1Winner = this.handleTeam1Winner.bind(this);
    this.handleTeamWinner = this.handleTeamWinner.bind(this);
    this.getEmojiWord = this.getEmojiWord.bind(this);
    this.submitEmoji = this.submitEmoji.bind(this);
    this.checkNow = this.checkNow.bind(this);
  }
  componentDidMount () {

    this.getEmojiWord()
    this.setState(() => ({
      playersTeam : this.props.playersTeam
    }))
    //console.log('theme'+ Themes[emojiWord(this.props.id)])
    //console.log('emoji word returned:' + emojiWord(this.props.id))
  }
  getEmojiWord () {
    const id = this.props.id;
    const theme = firebasedb.ref(`games/${id}/theme`).once('value').then((snapshot) => {
      const value =  snapshot.val();
      const themeArr = Themes[value]
      themeInfo(this.props.id, themeArr.length-1);
      this.setState(() => ({
        theme: themeArr,
      }))

      const check = firebasedb.ref(`games/${id}/themeActive`)
      check.on('value', (snapshot1) => {
        const themePosition = snapshot1.val();
        console.log(themePosition)
        const current = themeArr[themePosition]
        this.setState(() => ({
          emojiWord: current
        }))
      })
    })
  }
  checkNow () {

  }
  handleChange ({ target }) {
    this.setState(() => ({
      emoji : target.value,
    }))
  }
  submitEmoji () {
    //is going to also make post request passing in this.state.emoji
    postEmoji(this.state.emoji, this.state.playersTeam, this.props.id);

    this.setState(() => ({render: 'submitWinner'}))

  }
  handleTeamWinner (winner) {
    let id = this.props.id
    console.log(id);
    this.setState(() => ({
      winner
    }))
    setTimeout(() => {
      addPoint(winner, this.state.playersTeam, id)
    }, 1000)
    if(this.state.count === 0){
      this.setState(()=>({count : 1}))
      var playersTurn = firebasedb.ref(`games/${id}/turnAmount`).once('value').then(function(snapshot1){
        const amount1 = snapshot1.val() + 1;
        const updates2 = {};
        updates2[`games/${id}/turnAmount`] = amount1;
        firebasedb.ref().update(updates2)
      })
    }


    setTimeout(() => {
      const amount = firebasedb.ref(`games/${this.props.id}/playerAmount`).once('value').then((snapshot) => {
        const totalAmount = snapshot.val()
        const turnAmount = firebasedb.ref(`games/${this.props.id}/turnAmount`).once('value').then((snapshot1) => {
          const totalTurn = snapshot1.val();
          if(totalAmount === totalTurn){
            endGame(this.props.id, 'end')
          }
        })
      })
    }, 3000)

  }
  render () {
    return (
      <div className='emoji-main'>
        {this.state.render === 'submit'
          ? <div className='emoji-submit'>
              <h1>{this.state.emojiWord}</h1>
              <input placeholder='Enter Emoji' className='emoji-input1' onChange={this.handleChange}/>
              <button className='emoji-button1' onClick={this.submitEmoji}>Submit</button>
              <p>Enter some emojis to help your team guess the word above!</p>
            </div>
          : null
        }
       {
        this.state.render === 'submitWinner'
          ? <div className='submit-winner'>
              <h1>{this.state.emojiWord}</h1>
              <button onClick={() => this.handleTeamWinner('team1')} className='emoji-buttons'>Team 1</button>
              <button onClick={() => this.handleTeamWinner('team2')} className='emoji-buttons'>Team 2</button>
            </div>
          : null
       }
      </div>
    )
  }
}

export default EmojiPicker