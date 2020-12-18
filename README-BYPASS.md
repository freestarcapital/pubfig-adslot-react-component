# Bypassing Freestar Placements

The Frestar React Component allows for the ability to bypass relying on Freestar placements. 
Note: Using this option will not allow Freestar to monetize the adUnit with header bidding demand nor allow Freestar to
manage the ad unit. 

### Example

```js
import React, { Component } from 'react'

import FreestarAdSlot from '@freestar/pubfig-adslot-react-component'

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
    const slotSize = [[300,250], [728,90]]
    const sizeMapping = [
        {viewport: [0,0], slot: [300,250]},
        {viewport: [768, 0], slot: [728,90]}
    ]
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
          adUnitPath='/45796/my_adunit_name'
          slotSize={slotSize}
          sizeMapping={sizeMapping}
        />
        <button onClick={this.onAdRefresh}>Trigger Refresh</button>
      </div>
    )
  }
}

export default Demo
```

### Additional Props
**adUnitPath**
An *optional* string with the full GAM ad unit path. This should be used only if you are intending to bypass Freestar placements intentionally.

**slotSize**
An *optional* string or array as defined by [GPT Documentation](https://developers.google.com/publisher-tag/reference#googletag.GeneralSize). Should only be used in conjuction with `adUnitPath`

**sizeMapping**
An *optional* array of object which contains an array of viewport size and slot size. To be used in conjunction with `adUnitPath`. This needs to be set if the ad needs to serve different ad size per different view port sizes (responsive ad).
Setting the `slot` to any dimension that's not configured in DFP results in rendering an empty ad.
The ad slot size which is provided for the viewport size of [0, 0] will be used as default ad size if none of viewport size matches.

https://support.google.com/dfp_premium/answer/3423562?hl=en
         
    e.g.
         
    sizeMapping={[
        {viewport: [0, 0], slot: [320, 50]},
        {viewport: [768, 0], slot: [728, 90]}
    ]}
          
