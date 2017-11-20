import React from 'react'
import PropTypes from 'prop-types'
import { Card, CardTitle, CardText } from 'reactstrap'
import './Servers.css'

const Servers = props => (
  <div className='servers-container'>
    {props.servers.map(
      server => (
        <Card key={server.hostid} style={{ backgroundColor: '#333', borderColor: '#333' }}>
          <CardTitle>Hostname: {server.hostname}</CardTitle>
          <CardText>Host ID: {server.hostid}</CardText>
        </Card>
      )
    )}
  </div>
)

Servers.propTypes = {
  servers: PropTypes.array
}

export default Servers