import React, { Component } from 'react'
import PropTypes from 'prop-types'

class FreestarAdSlot extends Component {
  componentDidMount () {
    const { publisher, debug } = this.props
    const qa = debug ? '/qa' : ''
    const url = `https://a.pub.network/${publisher}${qa}/pubfig.min.js`

    const script = document.createElement('script')
    script.src = url
    document.body.appendChild(script)
    script.onload = () => {
      window.freestar.hitTime = Date.now()
      window.freestar.queue = []
      window.freestar.config = {}
      this.newAdSlots()
    }
  }

  componentWillUnmount () {
    const { placementName, onDeleteAdSlotsHook } = this.props
    window.freestar.deleteAdSlots({ placementName })
    onDeleteAdSlotsHook(placementName)
  }

  newAdSlots = () => {
    const { placementName, onNewAdSlotsHook, channel } = this.props
    window.freestar.newAdSlots({
      slotId: placementName,
      placementName
    }, channel)
    onNewAdSlotsHook(placementName)
  }

  classes = () => {
    const { classList } = this.props
    return (classList) ? classList.join(' ') : ''
  }

  render() {
    const { placementName } = this.props
    return (
      <div>
        <div className={this.classes()} id={placementName}></div>
      </div>
    )
  }
}

FreestarAdSlot.propTypes = {
  publisher: PropTypes.string.isRequired,
  placementName: PropTypes.string.isRequired,
  targeting: PropTypes.object,
  channel: PropTypes.string,
  classList: PropTypes.array,
  onNewAdSlotsHook: PropTypes.func,
  onDeleteAdSlotsHook: PropTypes.func
}

FreestarAdSlot.defaultProps = {
  publisher: '',
  placementName: '',
  targeting: {},
  channel: null,
  classList: [],
  onNewAdSlotsHook: () => {},
  onDeleteAdSlotsHook: () => {}
}

export default FreestarAdSlot
