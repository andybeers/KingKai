import React from 'react'
import PropTypes from 'prop-types'
import './snapshots.css'

const Snapshots = props => (
  <div className="text-light">
    <h6>Snapshots for {props.hostName}</h6>
    <ul>
      {props.snapshots.map(snap => (
        <li key={snap._id}>Virtual memory active: {snap.memory.virtual.active}</li>
      ))}
    </ul>
  </div>
)

Snapshots.propTypes = {
  snapshots: PropTypes.array,
  hostName: PropTypes.string
}

export default Snapshots
