import React, { Component } from 'react'

import FreestarAdSlot from './components/FreestarAdSlot/index'

import './demo.css'

class Demo extends Component {
  state = {
    adRefreshCount: 0
  }

  componentDidMount () {
    // example of automatically refreshing an ad every 5 seconds a total of 5 times
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
    }, 5000)
  }

  // example of manually refreshing an ad
  onAdRefresh = () => {
    const { adRefreshCount } = this.state
    this.setState({
      adRefreshCount: adRefreshCount + 1
    })
  }

  render() {
    const adUnit = {
      placementName: 'div-gpt-ad-leaderboard-multi',
      slotId: 'div-gpt-ad-leaderboard-multi',
      targeting: ['value1', 'value2']
    }
    const { adRefreshCount } = this.state
    return (
      <div>
        <FreestarAdSlot
          adUnit={adUnit}
          channel='custom_channel'
          classList={['m-30', 'p-15', 'b-thin-red']}
          adRefresh={adRefreshCount}
          onNewAdSlotsHook={(placementName) => console.log('freestar.newAdSlots() was called', {placementName})}
          onDeleteAdSlotsHook={(placementName) => console.log('freestar.deleteAdSlots() was called', {placementName})}
          onAdRefreshHook={(placementName) => console.log('adRefresh was called', {placementName})}
        />
        <button onClick={this.onAdRefresh}>Trigger Refresh</button>
      </div>
    )
  }
}

export default Demo
