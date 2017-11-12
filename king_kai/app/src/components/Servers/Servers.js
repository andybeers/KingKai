import React from 'react'
import PropTypes from 'prop-types'
import './Servers.css'

const Servers = props => (
  <div className='servers-container'>
    <h3>Heres yer dang servers.</h3>
    <ul>
      {props.servers.map(
        server => <li key={server._id}>{server.hostname}</li>
      )}
    </ul>
  </div>
)

Servers.propTypes = {
  servers: PropTypes.array
}

export default Servers