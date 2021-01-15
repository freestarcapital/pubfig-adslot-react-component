// Load the full build.
import _ from 'lodash';
class FreestarWrapper {
  constructor() {
    this.pageKeyValuePairs = {}
    this.keyValueConfigMappings = []
  }
  async fetchKeyValueConfigMapping(placementMappingLocation) {
    const response = await fetch(placementMappingLocation)

    if (response.status !== 200) {
      const message = `An error has occurred fetching keyValueConfigMapping: ${response.status}`;
      console.log(message)
      return [];
    }
    try{
      return await response.json();
    }
    catch (err)
    {
      const message = `An error has occurred fetching keyValueConfigMapping`;
      console.log(message, err)
      return [];
    }
  }
  async init(publisher, keyValueConfigMappingLocation) {
    window.freestarReactCompontentLoaded = window.freestarReactCompontentLoaded || false
    this.loaded = window.freestarReactCompontentLoaded
    this.logEnabled = window.location.search.indexOf('fslog') > -1 ? true
      : window.freestarReactCompontentLogEnabled ? window.freestarReactCompontentLogEnabled : false
    if (!this.loaded) {
      this.loaded = window.freestarReactCompontentLoaded = true
      const qa = window.location.search.indexOf('fsdebug') > -1 ? '/qa' : ''
      const url = `https://a.pub.network/${publisher}${qa}/pubfig.min.js`

      window.freestar = window.freestar || {}
      window.freestar.hitTime = Date.now()
      window.freestar.queue =  window.freestar.queue || []
      window.freestar.config =  window.freestar.config || {}
      window.freestar.config.enabled_slots = window.freestar.config.enabled_slots || []

      const script = document.createElement('script')
      script.src = url
      script.async = true
      this.log(0,"========== LOADING Pubfig ==========")
      document.body.appendChild(script)
      if (keyValueConfigMappingLocation) {
        this.keyValueConfigMappings = await this.fetchKeyValueConfigMapping(keyValueConfigMappingLocation)
      }
    }
  }
  log (level, ...msg)  {
    let title = 'Pubfig React Plugin ', styles = 'background: #00C389; color: #fff; border-radius: 3px; padding: 3px'
    if (this.logEnabled) {
      console.info(`%c${title}`, styles, ...msg)
    }
  }

  /* example mapping
    [
      {
        keyValuePairs : { site : 'fanatics', section: 'NBA'}
        placementMap : { placement-1 : 'NBA-placement-1', placement-2 : 'NBA-placement-2'}
      },
      {
        keyValuePairs : { site : 'fanatics', section: 'NFL'}
        placementMap : { placement-1 : 'NFL-placement-1', placement-2 : 'NFL-placement-2'}
      }
    ]
   */
  /**
   *
   * @param placementName
   * @param targeting
   * @returns {*}
   */
  getMappedPlacementName (placementName, targeting) {
    const keyValuePairs = {...this.pageKeyValuePairs, ...targeting}
    const matchedMappings = this.keyValueConfigMappings.filter((mapping) => {
      const mappedKeyValuePairs = mapping['keyValuePairs'] || {}
      for ( let key in mappedKeyValuePairs) {
          if ( mappedKeyValuePairs.hasOwnProperty(key)) {
            // if the values are arrays we need to sort them so that they can be directly compared
            let passedValue = Array.isArray(keyValuePairs[key]) ? _.sortBy(keyValuePairs[key]) : keyValuePairs[key]
            let mappedValue = Array.isArray(mappedKeyValuePairs[key]) ? _.sortBy(mappedKeyValuePairs[key]) : mappedKeyValuePairs[key]
            if (!_.isEqual(passedValue,mappedValue)){
              return false
            }

          }
      }
      return true

    })
    if (matchedMappings.length){
      let sortedMappings = _.sortBy(matchedMappings, (mapping) => {
        return mapping['keyValuePairs'].length
      })
      //lodash sorts asc by default
      sortedMappings.reverse();
      const matchedMapping = sortedMappings[0]
      const placementMap = matchedMapping['placementMap']
      return placementMap[placementName] || placementMap
    }
    return placementName
  }
  newAdSlot (placementName, onNewAdSlotsHook, channel, targeting, adUnitPath, slotSize, sizeMappings) {
    window.freestar.queue.push(() => {
      let adSlot;
      if (!adUnitPath) {
        placementName = this.getMappedPlacementName(placementName, targeting)
        window.freestar.newAdSlots({
            slotId: placementName,
            placementName,
            targeting
          }, channel)
      }
      else {

        adSlot = window.googletag.defineSlot(adUnitPath, slotSize, placementName).addService(window.googletag.pubads())
        if (sizeMappings) {
          const sizeMappingArray = sizeMappings
            .reduce((mapping, size) => {
              return mapping.addSize(size.viewport, size.slot)
            }, window.googletag.sizeMapping())
            .build()
          adSlot.defineSizeMapping(sizeMappingArray)

        }
        if (targeting) {
          Object.entries(targeting).forEach(entry => {
            const [key, value] = entry;
            adSlot.setTargeting(key, value);
          })
        }
        window.googletag.display(adSlot)
        window.googletag.pubads().refresh([adSlot])

      }
      if (onNewAdSlotsHook) {
        onNewAdSlotsHook(placementName)
      }
      return adSlot
    })

  }

  deleteAdSlot (placementName, targeting, onDeleteAdSlotsHook, adSlot) {
    window.freestar.queue.push(() => {
      if(!adSlot){
        placementName = this.getMappedPlacementName(placementName, targeting)
        window.freestar.deleteAdSlots({ placementName })
      }
      else {
        window.googletag.destroySlots([adSlot])
      }
      if (onDeleteAdSlotsHook) {
        onDeleteAdSlotsHook(placementName)
      }
    })
  }

  refreshAdSlot (placementName, targeting, onAdRefreshHook, adSlot) {
    window.freestar.queue.push(() => {
      if(!adSlot){
        placementName = this.getMappedPlacementName(placementName, targeting)
        window.freestar.freestarReloadAdSlot(placementName)
      }
      else {
        window.googletag.pubads().refresh([adSlot])
      }
      if (onAdRefreshHook) {
        onAdRefreshHook(placementName)
      }
    })
  }

  setPageTargeting (key, value) {
    window.freestar = window.freestar || {}
    window.freestar.queue =  window.freestar.queue || []
    window.freestar.queue.push(() => {
      window.googletag.pubads().setTargeting(key, value)
    })
    this.pageKeyValuePairs[key] = value
  }

  clearPageTargeting (key) {
    window.freestar = window.freestar || {}
    window.freestar.queue =  window.freestar.queue || []
    window.freestar.queue.push(() => {
      if (key) {
        window.googletag.pubads().clearTargeting(key)
      } else {
        window.googletag.pubads().clearTargeting()
      }
    })
    if (key) {
      delete this.pageKeyValuePairs[key]
    } else {
      this.pageKeyValuePairs = {};
    }

  }
}

const Freestar = new FreestarWrapper()

export default Freestar
