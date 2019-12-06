# Freestar Pubfig Ad Slot React Component

### Install

```sh
npm install --save @freestar/pubfig-adslot-react-component
```

### Usage

```js
import FreestarAdSlot from '@freestar/pubfig-adslot-react-component'

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
