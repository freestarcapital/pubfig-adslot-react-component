# Freestar Pubfig Ad Slot React Component

## NOTE: As of v1.1, the prerequisite of the core Pubfig code loaded in the HEAD is no longer required.

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
  render() {
    const placementName = 'PublisherName_970x250_728x90_320x50'
    const slotId = 'in_content_ad_1'
    const publisher = 'publisherName'
    const targeting = { key1: 'value1', key2: 'value2' }
    const { adRefresh } = this.state
    
    return (
      <div>
        <FreestarAdSlot
          publisher={publisher}
          placementName={placementName}
          slotId={slotId}
          targeting={targeting}
          channel='custom_channel'
          classList={['m-30', 'p-15', 'b-thin-red']}
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
```

### Props

**publisher**
A *required* string of the publisher, which will be provided by Freestar.

**placementName**
A *required* string of the ad unit placement, which will be provided by Freestar.

**slotId**
An *optional* string to specific the element id of the containing div around the adslot. Defaults to the placement. 

**targeting**
An *optional* object of key/value pairs for targeting.

**channel**
An *optional* string of a custom channel to use.

**classList**
An *optional* array of strings representing any additional classes that should be applied to the wrapper dom element of the ad slot.

**adRefresh**
An *optional* number bound to the ad refresh. Increment this value to trigger a refresh of the ad slot. Please consult your Freestar support team for more information.

**onNewAdSlotsHook**
An *optional* event hook that returns the `placementName` when the component **mounts** and an ad is requested.

**onDeleteAdSlotsHook**
An *optional* event hook that returns the `placementName` when the component **unmounts**.

**onAdRefreshHook**
An *optional* event hook that returns the `placementName` when the component refreshes an ad.

**integrity**
An *optional* attribute that when passed enables SRI for our pubfig library. The component will use this value for the integrity attribute when loading pubfig 
### API Methods

**FreestarAdSlot.setPageTargeting**
Proxy for the GPT setTargeting call to set page level targeting. See [GPT documentation](https://developers.google.com/doubleclick-gpt/reference#googletag.PubAdsService_setTargeting) for more details

**FreestarAdSlot.clearPageTargeting**
Proxy for the GRP clearTargeting call to clear page level targeting. See [GPT documentation](https://developers.google.com/doubleclick-gpt/reference#googletag.PubAdsService_clearTargeting) for more details

**FreestarAdSlot.trackPageView**
Proxy for the freestar.trackPageview() method.

Freestar collects data values such as url location which is then used in various tables. In order to properly track data sites that are using Single Page Applications (SPAs), or sites with slideshows/carousels that change urls/url parameters these new actions must be taken by the publisher to assure accuracy of the collected data. When the location and/or url is updated the lifecycle of the DOM and/or Window does not reload the pubfig.js script. In order to address this the publisher must invoke the freestar.trackPageview() method. This will ensure that the new url is stored and used throughout the data collection for that page or view. 

### Glossary

**placementName**
A value acquired from Google Ad Manager (previously known as DFP/Adx), which will be provided by Freestar.

**targeting**
A set of targeting values for the ad unit placement. See [GPT Documentation](https://developers.google.com/doubleclick-gpt/guides/key-value-targeting) for more details

### Bypassing Freestar Ad Placements
If you would like to bypass Freestar Ad placements and render GAM ad units yourself directly please follow the instructions [here](README-BYPASS.md)

### Queuing Freestar Ad Placements
If you would like to allow the freestar library to preload but need to hold of on ad delivery until buisness logic has completed please follow the instructions [here](README-QUEUE.md)
### Developer instructions

To publish your changes to npm do the following:

- PR your changes to Master
- Once approved, merge your branch to master
- Switch to the master branch and run the build `npm run build`
- Publish the package using np `np major|minor|patch`  
