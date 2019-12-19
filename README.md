# Freestar Pubfig Ad Slot React Component

### Install

```sh
npm install --save @freestar/pubfig-adslot-react-component
```

### Usage

```js
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
    return adUnits.map(adUnit => (
      <div key={adUnit.name}>
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
```

### Props

**adUnit**
A *required* object with *required* `placementName` & `slotId` and *optional* `targeting` properties.

**channel**
An *optional* string of a custom channel to use.

**classList**
An *optional* array of strings representing any additional classes that should be applied to the wrapper dom element of the ad slot.

**adRefresh**
An *optional* number bound to the ad refresh. You can increment this value to trigger a refresh of the ad slot.

### Glossary

**placementName**
A value acquired from Google Ad Manager (previously known as DFP/Adx), which will be provided by Freestar.

**slotId**
A value used for the DOM `<div>` id for the ad unit to render within.

**targeting**
A set of targeting values for the ad unit placement.
