import React from 'react'
import { array } from 'prop-types'
import Servers from '../Servers'
import Snapshots from '../Snapshots'
import AlertTest from '../AlertTest'
import './dashboard.css'

export default function Dashboard(props) {
  return (
    <div className='wrapper'>
      <Servers servers={props.servers} />
      <Snapshots snapshots={props.snapshots} hostName={props.snapshots.length ? props.snapshots[0].HOST_ID : 'Nope'} />
      <AlertTest />
    </div>
  )
}

Dashboard.propTypes = {
  servers: array,
  snapshots: array
}