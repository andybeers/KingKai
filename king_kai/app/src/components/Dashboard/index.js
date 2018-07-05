import React, { Component } from 'react'
import Servers from './Servers'
// import Snapshots from '../Snapshots'
import AlertTest from '../AlertTest'
import './dashboard.css'

class Dashboard extends Component {
  state = {
    servers: [],
  }

  componentDidMount() {
    this.fetchServers()
    // this.fetchSnapshots()
    // this._timerId = setInterval(() => {
    //   this.fetchServers()
    // }, 6000)
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
          loading: false,
        })
      })
      .catch(err => {
        this.setState({
          serverError: 'Servers done borked',
          loading: false,
        })
      })
  }

  render() {
    const { servers } = this.state
    return (
      <div className="wrapper">
        <Servers servers={servers} />
        {/* <Snapshots snapshots={props.snapshots} hostName={props.snapshots.length ? props.snapshots[0].HOST_ID : 'Nope'} /> */}
        <AlertTest />
      </div>
    )
  }
}

export default Dashboard
