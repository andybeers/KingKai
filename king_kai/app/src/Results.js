import React from 'react'
import PropTypes from 'prop-types'

const Results = props => (
  <div>
    <h3>Here's yer dang servers.</h3>
    <ul>
      {props.snapshots.map(
        snap => <li key={snap._id}>{snap.HOST_ID}: Virtual memory active: {snap.memory.virtual.active}</li>
      )}
    </ul>
  </div>
)

Results.propTypes = {
  snapshots: PropTypes.array
}

export default Results