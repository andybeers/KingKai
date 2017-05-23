import React from 'react';

const Results = props => (
    <div>
      <h1>Shit's here, yo.</h1>
      <ul>
        {props.snapshots.map(snap => <li key={snap._id}>{snap.HOST_ID}: Virtual memory active: {snap.memory.virtual.active}</li>)}
      </ul>
    </div>
  );

export default Results;