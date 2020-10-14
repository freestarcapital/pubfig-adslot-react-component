import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Freestar from "./freestarWrapper"



class FreestarAdSlot extends Component {
  componentDidMount () {
    const { publisher } = this.props
    const { placementName, onNewAdSlotsHook, channel, targeting } = this.props

    Freestar.load(publisher);
    Freestar.newAdSlot(placementName, onNewAdSlotsHook, channel, targeting)
  }

  componentWillUnmount () {
    const { placementName, onDeleteAdSlotsHook } = this.props
    Freestar.deleteAdSlot( placementName, onDeleteAdSlotsHook)
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

FreestarAdSlot.setPageTargeting = (key,value) => {
  Freestar.setPageTargeting(key,value)
}

FreestarAdSlot.clearPageTargeting = (key) => {
  Freestar.clearPageTargeting(key)
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
