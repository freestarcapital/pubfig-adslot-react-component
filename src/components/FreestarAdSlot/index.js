import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Freestar from "./freestarWrapper"



class FreestarAdSlot extends Component {
  componentDidMount () {
    const { publisher } = this.props
    const { placementName, onNewAdSlotsHook, channel, targeting } = this.props
    const { adUnitPath, slotSize, sizeMapping} = this.props;
    Freestar.init(publisher)
    this.adSlot = Freestar.newAdSlot(placementName, onNewAdSlotsHook, channel, targeting, adUnitPath, slotSize, sizeMapping)
  }

  componentWillUnmount () {
    const { placementName, onDeleteAdSlotsHook } = this.props
    Freestar.deleteAdSlot(placementName, onDeleteAdSlotsHook, this.adSlot)
  }

  componentWillReceiveProps (nextProps) {
    const { placementName, onAdRefreshHook } = this.props
    if (nextProps.adRefresh !== this.props.adRefresh) {
      Freestar.refreshAdSlot(placementName, onAdRefreshHook, this.adSlot)
    }
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
  placementName: PropTypes.string,
  targeting: PropTypes.object,
  channel: PropTypes.string,
  classList: PropTypes.array,
  adRefresh: PropTypes.number,
  onNewAdSlotsHook: PropTypes.func,
  onDeleteAdSlotsHook: PropTypes.func,
  onAdRefreshHook: PropTypes.func,
  adUnitPath : PropTypes.string,
  slotSize : PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  sizeMapping: PropTypes.arrayOf(
    PropTypes.shape({
      viewport: PropTypes.array,
      slot: PropTypes.array
    })
  )
}

FreestarAdSlot.defaultProps = {
  publisher: '',
  placementName: '',
  targeting: {},
  channel: null,
  classList: [],
  adRefresh: 0,
  onNewAdSlotsHook: () => {},
  onDeleteAdSlotsHook: () => {},
  onAdRefreshHook: () => {},
  adUnitPath: null,
  slotSize : null,
  sizeMapping: null
}

export default FreestarAdSlot
