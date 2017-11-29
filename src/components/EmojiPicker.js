import React from 'react';
import { emojiWord, postEmoji, addPoint } from '../api/index.js';

class EmojiPicker extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      emojiWord: '',
      emoji: '',
      render: 'submit',
      playersTeam: ''
    }
    this.handleChange = this.handleChange.bind(this);
    //this.handleTeam1Winner = this.handleTeam1Winner.bind(this);
    this.handleTeamWinner = this.handleTeamWinner.bind(this);
    this.getEmojiWord = this.getEmojiWord.bind(this);
    this.submitEmoji = this.submitEmoji.bind(this);
  }
  componentDidMount () {
    this.getEmojiWord()
    console.log('this should say team' + this.props.playersTeam)
    this.setState(() => ({
      playersTeam : this.props.playersTeam
    }))
  }
  getEmojiWord () {
    this.setState(() => ({
      emojiWord : emojiWord()
    }))
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
    this.setState(() => ({
      winner
    }))

    setTimeout(() => {
      addPoint(winner, this.state.playersTeam, this.props.id);
    },2000)
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