import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Freestar from './freestarWrapper'

class FreestarAdSlot extends Component {
  constructor (props) {
    super(props)
    const { placementName } = props
    this.state = { placementName }
  }

  async componentDidMount () {
    const {
      adUnitPath,
      channel,
      keyValueConfigMappingURL,
      onNewAdSlotsHook,
      placementName,
      publisher,
      sizeMapping,
      slotSize,
      targeting,
      queue
    } = this.props

    await Freestar.init(publisher, keyValueConfigMappingURL, queue)
    const mappedPlacementName = await Freestar.getMappedPlacementName(placementName, targeting)
    this.setState({ placementName: mappedPlacementName })
    Freestar.newAdSlot(mappedPlacementName, onNewAdSlotsHook, channel, targeting, adUnitPath, slotSize, sizeMapping)
  }

  componentWillUnmount () {
    const {
      adUnitPath,
      onDeleteAdSlotsHook,
      placementName,
      targeting
    } = this.props
    Freestar.deleteAdSlot(placementName, targeting, onDeleteAdSlotsHook, adUnitPath)
  }

  componentWillReceiveProps (nextProps) {
    const {
      adRefresh,
      adUnitPath,
      onAdRefreshHook,
      placementName,
      targeting,
      queue
    } = this.props
    if (nextProps.adRefresh !== adRefresh) {
      Freestar.refreshAdSlot(placementName, targeting, onAdRefreshHook, adUnitPath)
    }
    if (nextProps.queue !== queue) {
      Freestar.queueAdCalls(nextProps.queue)
    }
  }

  classes = () => {
    const { classList } = this.props
    return (classList) ? classList.join(' ') : ''
  }

  render () {
    const { placementName } = this.state
    return (
      <div>
        <div className={this.classes()} id={placementName}></div>
      </div>
    )
  }
}

FreestarAdSlot.setPageTargeting = (key, value) => {
  Freestar.setPageTargeting(key, value)
}

FreestarAdSlot.clearPageTargeting = (key) => {
  Freestar.clearPageTargeting(key)
}

FreestarAdSlot.trackPageview = () => {
  Freestar.trackPageview()
}

FreestarAdSlot.queueAdCalls = (queue) => {
  Freestar.queueAdCalls(queue)
}

FreestarAdSlot.propTypes = {
  publisher: PropTypes.string.isRequired,
  placementName: PropTypes.string.isRequired,
  targeting: PropTypes.object,
  channel: PropTypes.string,
  classList: PropTypes.array,
  adRefresh: PropTypes.number,
  onNewAdSlotsHook: PropTypes.func,
  onDeleteAdSlotsHook: PropTypes.func,
  onAdRefreshHook: PropTypes.func,
  adUnitPath: PropTypes.string,
  slotSize: PropTypes.oneOfType([ PropTypes.array, PropTypes.string ]),
  sizeMapping: PropTypes.arrayOf(
    PropTypes.shape({
      viewport: PropTypes.array,
      slot: PropTypes.array
    })
  ),
  keyValueConfigMappingURL: PropTypes.string,
  queue: PropTypes.bool
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
  slotSize: null,
  sizeMapping: null,
  keyValueConfigMappingURL: null,
  queue: false
}

export default FreestarAdSlot
