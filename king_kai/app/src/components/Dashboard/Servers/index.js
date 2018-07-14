import React from 'react'
import PropTypes from 'prop-types'
import { Button, ListGroup, ListGroupItem } from 'reactstrap'
import './servers.css'

const Servers = props => (
  <div className="servers-container">
    <ListGroup className="server-list">
      {props.servers.map(server => (
        <ListGroupItem
          key={server.hostid}
          className="d-flex justify-content-between align-items-center"
        >
          <div>{server.hostid}</div>
          <div>Uptime: {server.uptime}</div>
          <div>
            <Button color="primary" size="sm" className="ml-2">
              Expand
            </Button>
            <Button color="primary" size="sm" className="ml-2">
              Snapshots
            </Button>
          </div>
        </ListGroupItem>
      ))}
    </ListGroup>
  </div>
)

Servers.propTypes = {
  servers: PropTypes.array,
}

export default Servers
