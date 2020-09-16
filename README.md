# Freestar Pubfig Ad Slot React Component

### Install

```sh
npm install --save @freestar/pubfig-adslot-react-component
```

### Usage

```js
import React from 'react'
 
import FreestarAdSlot from '@freestar/pubfig-adslot-react-component'

import './demo.css'

const Demo = () => {
  const placementName = 'PublisherName_970x250_728x90_320x50'
  const targeting = { key1: 'value1', key2: 'value2' }

  return (
    <div>
      <FreestarAdSlot
        publisher='publishername'
        placementName={placementName}
        targeting={targeting}
        channel='custom_channel'
        classList={['m-30', 'p-15', 'b-thin-red']}
        onNewAdSlotsHook={(placementName) => console.log('freestar.newAdSlots() was called', {placementName})}
        onDeleteAdSlotsHook={(placementName) => console.log('freestar.deleteAdSlots() was called', {placementName})}
      />
    </div>
  )
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

**onNewAdSlotsHook**
An *optional* event hook that returns the `placementName` when the component **mounts** and an ad is requested.

**onDeleteAdSlotsHook**
An *optional* event hook that returns the `placementName` when the component **unmounts**.

### Glossary

**placementName**
A value acquired from Google Ad Manager (previously known as DFP/Adx), which will be provided by Freestar.

**targeting**
A set of targeting values for the ad unit placement. https://developers.google.com/doubleclick-gpt/guides/key-value-targeting

### Develop

```sh
npm install
npm start
```
