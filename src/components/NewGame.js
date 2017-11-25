import React from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import { Link } from 'react-router-dom';

class NewGame extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      selectedOption: '',
      gameName: '',
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
  }
  handleChange (selectedOption) {
    this.setState({selectedOption});
  }
  handleNameChange({target}) {
    this.setState(() => ({
      gameName : target.value,
    }))
    console.log(this.state.gameName)
  }
  render () {
    return (
      <div className ='new-game-main'>
        <p>Select a theme:</p>
        <Select
          className='new-game-theme'
          name="form-field-name"
          value={this.state.selectedOption}
          onChange={this.handleChange}
          options={[
            { value: 'christmasSongs', label: 'Christmas Songs' },
            { value: 'chirstmasCharacters', label: 'Christmas Movie Characters' },
            { value: 'christmasFood', label: 'Christmas Food' },
            { value: 'Elf', label: 'Elf the movie' },
            { value: 'cities', label: 'Cities' },
          ]}
        />
        <input
          placeholder='Enter Game Name'
          onChange={this.handleNameChange}
          className='new-game-input'
        />
        <Link to ='/'>
          <button className='new-game-submit'>Submit</button>
        </Link>
      </div>
    )
  }
}

export default NewGame;