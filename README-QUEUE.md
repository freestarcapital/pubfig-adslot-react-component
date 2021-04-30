# Queuing Freestar Placements

The Freestar React Component allows for the ability queue the auctioning and rendering of Freestar placements. 


### Example

```js
import React, { Component } from 'react'

import FreestarAdSlot from '@freestar/pubfig-adslot-react-component'

import './demo.css'

class Demo extends Component {
  FreestarAdSlot.queueAdCalls(true)
  onHandleClick= () => {
    FreestarAdSlot.queueAdCalls(false)
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
    const { queue } = this.state
    
    return (
      <div>
        <FreestarAdSlot
          publisher={publisher}
          placementName={placementName}
          targeting={targeting}
          channel='custom_channel'
          classList={['m-30', 'p-15', 'b-thin-red']}
          onNewAdSlotsHook={(placementName) => console.log('creating ad', placementName)}
          onDeleteAdSlotsHook={(placementName) => console.log('destroying ad', placementName)}
          onAdRefreshHook={(placementName) => console.log('refreshing ad', placementName)}
        />
        <button onClick={this.onHandleClick()}>Trigger Ad Calls</button>
      </div>
    )
  }
}

export default Demo
```

### API Methods
**FreestarAdSlot.queueAdCalls**
Pass a  boolean that if set to true will restrict the Freestar Library from auctioning or rendering ad units. 
When the value is set to false any queued ad units will be flushed out and auction/rendered together. Please consult your 
Freestar Support Team before utilizing this to ensure its the best approach
