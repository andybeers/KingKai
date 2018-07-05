import React, { Component } from 'react'
import './app.css'
import AppHeader from '../AppHeader'
import Dashboard from '../Dashboard'

class App extends Component {
  state = {
    snapshots: [],
    loading: false,
    serverError: '',
    snapsError: '',
  }

  // fetchSnapshots() {
  //   fetch('http://localhost:9000/api/snapshots')
  //     .then(res => res.json())
  //     .then(res => {
  //       this.setState({
  //         snapshots: res,
  //         snapsError: ''
  //       })
  //     })
  //     .catch(err => {
  //       this.setState({ snapsError: 'Snaps done borked' })
  //     })
  // }

  componentWillUnmount() {
    clearInterval(this._timerId)
  }

  render() {
    const { loading } = this.state

    if (loading) return <h1>LOADING</h1>

    return (
      <div className="App">
        <AppHeader />
        <Dashboard />
      </div>
    )
  }
}

export default App
