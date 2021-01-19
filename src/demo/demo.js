import React, { Component } from 'react'

import FreestarAdSlot from './components/FreestarAdSlot/index'

import './demo.css'

class Demo extends Component {
  state = {
    adRefresh: 0
  }

  onAdRefresh = () => {
    const { adRefresh } = this.state
    this.setState({
      adRefresh: adRefresh + 1
    })
  }

  render() {
    const placementName = 'PublisherName_970x250_728x90_320x50'
    const publisher = 'publisherName'
    const targeting = { key1: 'value1', key2: 'value2' }

    const { adRefresh } = this.state

    return (
      <div>
        <FreestarAdSlot
          publisher={publisher}
          placementName={placementName}
          targeting={targeting}
          channel='custom_channel'
          classList={['m-30', 'p-15', 'b-thin-red']}
          adRefresh={adRefresh}
          onNewAdSlotsHook={(placementName) => console.log('creating ad', placementName)}
          onDeleteAdSlotsHook={(placementName) => console.log('destroying ad', placementName)}
          onAdRefreshHook={(placementName) => console.log('refreshing ad', placementName)}
        />
        <button onClick={this.onAdRefresh}>Trigger Refresh</button>
      </div>
    )
  }
}

export default Demo
