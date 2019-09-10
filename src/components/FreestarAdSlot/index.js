import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Promise } from 'q'

const getFreestar = () => {
  return new Promise((resolve, reject) => {
    const maxTries = 10
    let retryCount = 0
    const waitForFreestarReady = setInterval(() => {
      if (window.freestar && window.googletag && window.googletag.apiReady) {
        clearInterval(waitForFreestarReady)
        resolve(window.freestar)
      } else if (retryCount === maxTries) {
        clearInterval(waitForFreestarReady)
        reject(`freestar NOT ready after ${maxTries} tries`)
      } else {
        retryCount++
      }
    }, 10)
  })
}

class FreestarAdSlot extends Component {
  componentDidMount () {
    this.newAdSlots()
  }

  componentWillUnmount () {
    const { adUnit, onDeleteAdSlotsHook } = this.props
    getFreestar().then(freestar => {
      if (this.adSlotIsReady(adUnit)) {
        freestar.deleteAdSlots(adUnit)
        onDeleteAdSlotsHook(adUnit.placementName)
      }
    })
  }

  componentWillReceiveProps (nextProps) {
    const { adUnit, onAdRefreshHook } = this.props
    if (nextProps.adRefresh !== this.props.adRefresh) {
      this.newAdSlots()
      onAdRefreshHook(adUnit.placementName)
    }
  }

  newAdSlots = () => {
    const { adUnit, onNewAdSlotsHook } = this.props
    getFreestar().then(freestar => {
      if (this.adSlotIsReady(adUnit)) {
        freestar.newAdSlots(adUnit)
        onNewAdSlotsHook(adUnit.placementName)
      }
    })
  }

  adSlotIsReady = ({ placementName, slotId }) => placementName && slotId && document.getElementById(placementName)

  classes = () => {
    const { classList } = this.props
    return (classList) ? classList.join(' ') : ''
  }

  render() {
    const { adUnit } = this.props
    return (
      <div>
        <div className={this.classes()} id={adUnit.placementName}></div>
      </div>
    )
  }
}

FreestarAdSlot.propTypes = {
  adUnit: PropTypes.shape({
    placementName: PropTypes.string.isRequired,
    slotId: PropTypes.string.isRequired,
  }).isRequired,
  classList: PropTypes.array,
  adRefresh: PropTypes.number,
  onNewAdSlotsHook: PropTypes.func,
  onDeleteAdSlotsHook: PropTypes.func,
  onAdRefreshHook: PropTypes.func
};

FreestarAdSlot.defaultProps = {
  adUnit: {},
  classList: [],
  adRefresh: 0,
  onNewAdSlotsHook: () => {},
  onDeleteAdSlotsHook: () => {},
  onAdRefreshHook: () => {}
}

export default FreestarAdSlot
