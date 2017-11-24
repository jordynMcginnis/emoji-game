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
    console.log(`Selected: ${selectedOption.label}`)
    console.log(this.state.selectedOption)
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
          className='select-theme'
          name="form-field-name"
          value={this.state.value}
          onChange={this.handleChange}
          options={[
            { value: 'christmasSongs', label: 'Christmas Songs' },
            { value: 'test', label: 'Other theme' },
          ]}
        />
        <input
          placeholder='Enter Game Name'
          onChange={this.handleNameChange}
          className='new-game-input'
        />
        <Link to ='/'>
          <button>Submit</button>
        </Link>
      </div>
    )
  }
}

export default NewGame;