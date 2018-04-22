import React, { Component } from 'react'
import './app.css'
import AppHeader from '../AppHeader'
import Dashboard from '../Dashboard'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      servers: [],
      snapshots: []
    }
  }

  fetchServers() {
    console.log('Fetching data...')
    fetch('http://localhost:9000/api/servers')
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
    fetch('http://localhost:9000/api/snapshots')
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
    this.fetchServers()
    this.fetchSnapshots()
    // this._timerId = setInterval(() => {
    //   this.fetchServers()
    // }, 6000)
  }

  componentWillUnmount() {
    clearInterval(this._timerId)
  }

  render() {
    return (
      <div className="App">
        <AppHeader />
        <Dashboard servers={this.state.servers} snapshots={this.state.snapshots} />
      </div>
    )
  }
}

export default App
