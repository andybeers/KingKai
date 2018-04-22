import React, { Component } from 'react'
import './app.css'
import AppHeader from '../AppHeader'
import Dashboard from '../Dashboard'
// import LoadingIcon from '../LoadingIcon'

class App extends Component {
  state = {
    servers: [],
    snapshots: [],
    loading: false,
    serverError: '',
    snapsError: ''
  }

  fetchServers() {
    console.log('Fetching data...')
    this.setState({ loading: true })
    fetch('http://localhost:9000/api/servers')
      .then(res => res.json())
      .then(res => {
        this.setState({
          servers: res,
          serverError: '',
          loading: false
        })
      })
      .catch(err => {
        this.setState({
          serverError: 'Servers done borked',
          loading: false
        })
      })
  }

  fetchSnapshots() {
    fetch('http://localhost:9000/api/snapshots')
      .then(res => res.json())
      .then(res => {
        this.setState({
          snapshots: res,
          snapsError: ''
        })
      })
      .catch(err => {
        this.setState({ snapsError: 'Snaps done borked' })
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
    const { loading, serverError, snapsError } = this.state

    // if (loading) return <LoadingIcon />

    return (
      <div className="App">
        <AppHeader />
        {(serverError || snapsError) &&
          `Server error: ${serverError} ::: Snaps error: ${snapsError}`}
        <Dashboard servers={this.state.servers} snapshots={this.state.snapshots} />
      </div>
    )
  }
}

export default App
