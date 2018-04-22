import React from 'react'
import PropTypes from 'prop-types'
import { Card, CardTitle, CardText, ListGroup, ListGroupItem } from 'reactstrap'
import './servers.css'

const Servers = props => (
  <div className='servers-container'>
    <ListGroup className='server-list'>
      {props.servers.map(
        server => (
          <ListGroupItem key={server.hostid} className='d-flex'>
            <div>Hostname: {server.hostname}</div>
            <div className='ml-4'>Host ID: {server.hostid}</div>
          </ListGroupItem>
        )
      )}
    </ListGroup>
  </div>
)

Servers.propTypes = {
  servers: PropTypes.array
}

export default Servers