import React from 'react';

class EmojiPicker extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      emoji: '',
      render: 'submit'
    }
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange ({ target }) {
    this.setState(() => ({
      emoji : target.value
    }))
  }
  render () {
    return (
      <div className='emoji-main'>
        {this.state.render === 'submit'
          ? <div className='emoji-submit'>
              <h1>Santa Baby</h1>
              <input placeholder='Enter Emoji' className='emoji-input1' onChange={this.handleChange}/>
              <button className='emoji-button1'>Submit</button>
            </div>
          : null
         }
         {
          this.state.render === 'submitWinner'
            ? <div className='submit-winner'>
                <h1>Santa Baby</h1>
                <button className='emoji-buttons'>Team 1</button>
                <button className='emoji-buttons'>Team 2</button>
              </div>
            : null
         }

      </div>
    )
  }
}

export default EmojiPicker