# Freestar Pubfig Ad Slot React Component

### Install

```sh
npm install --save @freestar/pubfig-adslot-react-component
```

### Usage

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

### Props

**publisher**
A *required* string of the publisher, which will be provided by Freestar.

**placementName**
A *required* string of the ad unit placement, which will be provided by Freestar.

**targeting**
An *optional* object of key/value pairs for targeting.

**channel**
An *optional* string of a custom channel to use.

**classList**
An *optional* array of strings representing any additional classes that should be applied to the wrapper dom element of the ad slot.

**adRefresh**
An *optional* number bound to the ad refresh. Increment this value to trigger a refresh of the ad slot.

**onNewAdSlotsHook**
An *optional* event hook that returns the `placementName` when the component **mounts** and an ad is requested.

**onDeleteAdSlotsHook**
An *optional* event hook that returns the `placementName` when the component **unmounts**.

**onAdRefreshHook**
An *optional* event hook that returns the `placementName` when the component refreshes an ad.

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
          
### API Methods

**FreestarAdSlot.setPageTargeting**
Proxy for the GPT setTargeting call to set page level targeting. See [GPT documentation](https://developers.google.com/doubleclick-gpt/reference#googletag.PubAdsService_setTargeting) for more details

**FreestarAdSlot.clearPageTargeting**
Proxy for the GRP clearTargeting call to clear page level targeting. See [GPT documentation](https://developers.google.com/doubleclick-gpt/reference#googletag.PubAdsService_clearTargeting) for more details

### Glossary

**placementName**
A value acquired from Google Ad Manager (previously known as DFP/Adx), which will be provided by Freestar.

**targeting**
A set of targeting values for the ad unit placement. See [GPT Documentation](https://developers.google.com/doubleclick-gpt/guides/key-value-targeting) for more details

### Develop

```sh
npm install
npm start
```
