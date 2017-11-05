import React, { Component } from 'react'
import './App.css'
import Results from './Results'
import AlertTest from './AlertTest'
import { Jumbotron, Button } from 'reactstrap'

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
        <Jumbotron>
          <h1 className='display-3'>King Kai</h1>
          <p className='lead'>You got servers? Yeah, you got servers.</p>
          <Button color='primary'>
            Do something
          </Button>  
        </Jumbotron>
        <AlertTest />
        <Results snapshots={this.state.snapshots}/>
      </div>
    )
  }
}

export default App
