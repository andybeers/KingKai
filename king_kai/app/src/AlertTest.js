import React from 'react'
import { Alert } from 'reactstrap'

class AlertTest extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      visible: true
    }

    this.onDismiss = this.onDismiss.bind(this)
  }

  onDismiss() {
    this.setState({ visible: false })
  }

  render() {
    return (
      <Alert color="warning" isOpen={this.state.visible} toggle={this.onDismiss}>
        I am an alert and I can be dismissed!
      </Alert>
    )
  }
}

export default AlertTest