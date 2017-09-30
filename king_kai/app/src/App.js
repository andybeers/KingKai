import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import Results from './Results'

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      snapshots: [],
    }
  }

  doFetch() {
    console.log('Fetching data...')
    fetch('http://localhost:3000/api/snapshots')
      .then(res => res.json())
      .then(snaps => {
        this.setState({
          snapshots: snaps
        })
      })
      .catch(err => {
        console.log('you done fucked up', err.message)
      })
  }

  componentDidMount() {
    this.doFetch()
    this._timerId = setInterval(() => {
      this.doFetch()
    }, 2000)
  }

  componentWillUnmount() {
    clearInterval(this._timerId)
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>KING KAI</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <Results snapshots={this.state.snapshots}/>
      </div>
    )
  }
}

export default App
