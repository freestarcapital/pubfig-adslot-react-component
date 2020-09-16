import React from 'react'

import FreestarAdSlot from './components/FreestarAdSlot/index'

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
