# Key Value Config Mapping

You can optional specify a configuration file to map placements based key value pairs. Do not use this without the support of your Freestar Team 

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
          placementMappingLocation = "https://api.jsonbin.io/b/6000f76fe31fbc3bdef3d725/1"
        />
        <button onClick={this.onAdRefresh}>Trigger Refresh</button>
      </div>
    )
  }
}

export default Demo
```

### Additional Props
**placementMappingLocation**
An *optional* string with the full url to the Key Value Config Mapping file. Consult with your Freestar Account Manager for more information on how to have this file setup
