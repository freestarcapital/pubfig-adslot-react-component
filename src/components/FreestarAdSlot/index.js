import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Freestar from './freestarWrapper'

class FreestarAdSlot extends Component {
  constructor(props) {
    super(props)
    const { placementName, slotId } = props
    const elementId = slotId ? slotId : `${placementName}`
    this.state = { placementName : placementName , slotId : elementId}
  }

  async componentDidMount () {
    const { adUnitPath, slotSize, sizeMapping, placementName, onNewAdSlotsHook, channel, targeting, keyValueConfigMappingURL, publisher } = this.props
    const { slotId } = this.state

    await Freestar.init(publisher, keyValueConfigMappingURL)
    const mappedPlacementName = await Freestar.getMappedPlacementName(placementName,targeting)
    this.setState({placementName: mappedPlacementName})
    Freestar.newAdSlot(mappedPlacementName,slotId, onNewAdSlotsHook, channel, targeting, adUnitPath, slotSize, sizeMapping)
  }

  componentWillUnmount () {
    const { onDeleteAdSlotsHook, targeting, adUnitPath } = this.props
    Freestar.deleteAdSlot(this.state.slotId, targeting, onDeleteAdSlotsHook, adUnitPath)
  }

  componentWillReceiveProps (nextProps) {
    const { placementName, onAdRefreshHook, targeting, adUnitPath, onNewAdSlotsHook, slotSize, sizeMapping } = this.props
    if (nextProps.adRefresh !== this.props.adRefresh) {
      Freestar.refreshAdSlot(placementName, this.state.slotId, targeting, onAdRefreshHook, adUnitPath)
    }
    if (nextProps.channel !== this.props.channel) {
      Freestar.newAdSlot(placementName, this.state.slotId, onNewAdSlotsHook, nextProps.channel, targeting, adUnitPath, slotSize, sizeMapping)
    }
  }

  classes = () => {
    const { classList } = this.props
    return (classList) ? classList.join(' ') : ''
  }

  render() {
    return (
      <div>
        <div className={this.classes()} id={this.state.slotId}></div>
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

FreestarAdSlot.trackPageview = () => {
  Freestar.trackPageview()
}

FreestarAdSlot.queueAdCalls = (queue) => {
  Freestar.queueAdCalls(queue)
}

FreestarAdSlot.propTypes = {
  publisher: PropTypes.string.isRequired,
  placementName: PropTypes.string.isRequired,
  slotId: PropTypes.string,
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
  ),
  keyValueConfigMappingURL: PropTypes.string,
  queue: PropTypes.bool
}

FreestarAdSlot.defaultProps = {
  publisher: '',
  placementName: '',
  slotId: null,
  targeting: {},
  channel: null,
  classList: [],
  adRefresh: 0,
  onNewAdSlotsHook: () => {},
  onDeleteAdSlotsHook: () => {},
  onAdRefreshHook: () => {},
  adUnitPath: null,
  slotSize : null,
  sizeMapping: null,
  keyValueConfigMappingURL: null
}

export default FreestarAdSlot
