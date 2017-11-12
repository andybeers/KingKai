import React, { Component } from 'react'
import './App.css'
import Servers from '../Servers/Servers'
import Snapshots from '../Snapshots/Snapshots'
import AlertTest from '../AlertTest/AlertTest'
import { Button } from 'reactstrap'

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      servers: [],
      snapshots: [],
    }
  }

  doFetch() {
    console.log('Fetching data...')
    fetch('http://localhost:3000/api/servers')
      .then(res => res.json())
      .then(res => {
        this.setState({
          servers: res
        })
      })
      .catch(err => {
        console.log('you done fucked up', err.message)
      })
  }

  fetchSnapshots() {
    fetch('http://localhost:3000/api/snapshots')
      .then(res => res.json())
      .then(res => {
        this.setState({
          snapshots: res
        })
      })
      .catch(err => {
        console.log('you done fucked up', err.message)
      })
  }

  componentDidMount() {
    this.doFetch()
    this.fetchSnapshots()
    this._timerId = setInterval(() => {
      this.doFetch()
    }, 6000)
  }

  componentWillUnmount() {
    clearInterval(this._timerId)
  }

  render() {
    return (
      <div className="App">
        <h1 className='display-3 logo'>King Kai</h1>
        <AlertTest />
        <Servers servers={this.state.servers} />
        <Snapshots snapshots={this.state.snapshots} hostName={this.state.snapshots.length ? this.state.snapshots[0].HOST_ID : 'Nope'} />
      </div>
    )
  }
}

export default App
