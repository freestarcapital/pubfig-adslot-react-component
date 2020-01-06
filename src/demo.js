import React, { Component } from 'react'

import FreestarAdSlot from './components/FreestarAdSlot/index'

import './demo.css'

class Demo extends Component {
  state = {
    adRefreshCount: 0,
    adUnits: []
  }

  componentDidMount () {
    if (window.freestar && window.freestar.fsdata && window.freestar.fsdata.placements) {
      const adUnits = window.freestar.fsdata.placements.map(adUnit => {
        return {
          placementName: adUnit.name,
          slotId: adUnit.name,
          // targeting: ['value1', 'value2'] // optionally pass specific targeting
        };
      });
      this.setState({ adUnits })
    } else {
      console.warn('Could not find window.freestar.fsdata. Please visit https://freestar.com/ or contact a Freestar representative.');
    }

    // example of automatically refreshing an ad every 30 seconds a total of 5 times
    this.createAutoRefresh();
  }

  createAutoRefresh = () => {
    const interval = setInterval(() => {
      const maxRefreshes = 5
      this.setState({
        adRefreshCount: this.state.adRefreshCount + 1
      }, () => {
        const { adRefreshCount } = this.state
        if (adRefreshCount === maxRefreshes) {
          clearInterval(interval)
        }
      })
    }, 30000)
  }

  generateAdSlots = () => {
    const { adRefreshCount, adUnits } = this.state
    return adUnits.map((adUnit, index) => (
      <div key={`adUnit-${index}`}>
        <FreestarAdSlot
          adUnit={adUnit}
          channel='custom_channel'
          classList={['m-30', 'p-15', 'b-thin-red']}
          adRefresh={adRefreshCount}
          onNewAdSlotsHook={(placementName) => console.log('freestar.newAdSlots() was called', {placementName})}
          onDeleteAdSlotsHook={(placementName) => console.log('freestar.deleteAdSlots() was called', {placementName})}
          onAdRefreshHook={(placementName) => console.log('adRefresh was called', {placementName})}
        />
      </div>
    ))
  }

  // example of manually refreshing an ad
  onAdRefresh = () => {
    const { adRefreshCount } = this.state
    this.setState({
      adRefreshCount: adRefreshCount + 1
    })
  }

  render() {
    return (
      <div>
        <button onClick={this.onAdRefresh}>Refresh All Ads</button>
        {this.generateAdSlots()}
      </div>
    )
  }
}

export default Demo
