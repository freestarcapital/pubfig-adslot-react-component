import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Freestar from "./freestarWrapper"




class FreestarAdSlot extends Component {
  constructor(props) {
    const { placementName } = props
    super(props);
    this.state = { placementName : placementName }
  }

  async componentDidMount () {
    const { placementName, onNewAdSlotsHook, channel, targeting, keyValueConfigMappingURL, publisher } = this.props
    const { adUnitPath, slotSize, sizeMapping} = this.props;

    await Freestar.init(publisher, keyValueConfigMappingURL)
    const mappedPlacementName = await Freestar.getMappedPlacementName(placementName,targeting)
    this.setState({placementName: mappedPlacementName})
    Freestar.newAdSlot(mappedPlacementName, onNewAdSlotsHook, channel, targeting, adUnitPath, slotSize, sizeMapping)
  }

  componentWillUnmount () {
    const { placementName, onDeleteAdSlotsHook, targeting, adUnitPath } = this.props
    Freestar.deleteAdSlot(placementName, targeting, onDeleteAdSlotsHook, adUnitPath)
  }

  componentWillReceiveProps (nextProps) {
    const { placementName, onAdRefreshHook, targeting, adUnitPath } = this.props
    if (nextProps.adRefresh !== this.props.adRefresh) {
      Freestar.refreshAdSlot(placementName, targeting, onAdRefreshHook, adUnitPath)
    }
  }

  classes = () => {
    const { classList } = this.props
    return (classList) ? classList.join(' ') : ''
  }

  render() {
    const { placementName, targeting, placementMappingLocation } = this.props
    return (
      <div>
        <div className={this.classes()} id={this.state.placementName}></div>
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
