// Load the full build.
import isEqual from 'lodash.isequal'
import sortBy from 'lodash.sortby'
class FreestarWrapper {
  constructor() {
    this.pageKeyValuePairs = {}
    this.mappingConfig = {}
    this.keyValueConfigMappings = []
    this.keyValueConfigMappingLocation = ''
    this.newAdSlotQueue = []
    this.adSlotsMap = {}
    this.queue = false
  }

  async fetchKeyValueConfigMapping(placementMappingLocation) {
    const response = await fetch(placementMappingLocation)

    if (response.status !== 200) {
      const message = `An error has occurred fetching keyValueConfigMapping: ${response.status}`;
      console.log(message)
      return [];
    }
    try{
      this.mappingConfig = await response.json();

      return this.mappingConfig['mappings']
    }
    catch (err)
    {
      const message = `An error has occurred fetching keyValueConfigMapping`;
      console.log(message, err)
      return [];
    }
  }

  async init(publisher, keyValueConfigMappingLocation, queue) {
    this.queue = queue
    window.freestarReactCompontentLoaded = window.freestarReactCompontentLoaded || false
    this.loaded = window.freestarReactCompontentLoaded
    this.logEnabled = window.location.search.indexOf('fslog') > -1 ? true
      : window.freestarReactCompontentLogEnabled ? window.freestarReactCompontentLogEnabled : false
    if (!this.loaded) {
      this.loaded = window.freestarReactCompontentLoaded = true
      this.keyValueConfigMappingLocation = keyValueConfigMappingLocation
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
      if (keyValueConfigMappingLocation && this.keyValueConfigMappings.length === 0) {
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
    {
      mappings:
        [
          {
            "keyValuePairs" : { "site" : 'fanatics', "section": 'NBA'}
            "placementMap" : { "placement-1" : 'NBA-placement-1', "placement-2" : 'NBA-placement-2'}
          },
          {
            "keyValuePairs" : { "site" : 'fanatics', "section": 'NFL'}
            "placementMap" : { "placement-1" : 'NFL-placement-1', placement-2 : 'NFL-placement-2'}
          }
        ]
    }
   */
  /**
   *
   * @param placementName
   * @param targeting
   * @param placementMappingLocation
   * @returns {*}
   */
  async getMappedPlacementName(placementName, targeting) {
    const keyValuePairs = {...this.pageKeyValuePairs, ...targeting}
    if (this.keyValueConfigMappingLocation && this.keyValueConfigMappings.length === 0) {
      this.keyValueConfigMappings = await this.fetchKeyValueConfigMapping(this.keyValueConfigMappingLocation)
    }

    const matchedMappings = this.keyValueConfigMappings.filter((mapping) => {
      const mappedKeyValuePairs = mapping['keyValuePairs'] || {}
      for (let key in mappedKeyValuePairs) {
        if (mappedKeyValuePairs.hasOwnProperty(key)) {
          // if the values are arrays we need to sort them so that they can be directly compared
          let passedValue = Array.isArray(keyValuePairs[key]) ? sortBy(keyValuePairs[key]) : keyValuePairs[key]
          let mappedValue = Array.isArray(mappedKeyValuePairs[key]) ? sortBy(mappedKeyValuePairs[key]) : mappedKeyValuePairs[key]
          if (!isEqual(passedValue, mappedValue)) {
            return false
          }

        }
      }
      return true

    })
    if (matchedMappings.length) {
      let sortedMappings = sortBy(matchedMappings, (mapping) => {
        return mapping['keyValuePairs'].length
      })
      //lodash sorts asc by default
      sortedMappings.reverse();
      const matchedMapping = sortedMappings[0]
      const placementMap = matchedMapping['placementMap']
      return placementMap[placementName] || placementName
    }
    return placementName
  }
  queueNewAdSlot (placementName, onNewAdSlotsHook, channel, targeting, adUnitPath, slotSize, sizeMappings) {
    const args = {placementName, onNewAdSlotsHook, channel, targeting, adUnitPath, slotSize, sizeMappings}
    this.newAdSlotQueue.push(args);
  }
  async flushQueuedNewAdSlots ()
  {
    let adMap = this.buildAdMap()
    this.newDirectGAMAdSlots(adMap.directGamAds)
    this.newPubfigAdSlots(null,adMap.nonChannelAds)
    for (const channel in adMap.channelAdMap) {
      this.newPubfigAdSlots(channel,adMap.channelAdMap[channel])
    }

  }

  buildAdMap() {
    const newAdSlotsToFlush = this.newAdSlotQueue;
    this.newAdSlotQueue = []
    let adMap = newAdSlotsToFlush.reduce( (adMap, newAdSlot) => {

      if (newAdSlot.adUnitPath) {
        adMap.directGamAds.push(newAdSlot)

        return adMap
      }
      if (newAdSlot.channel) {
        if (!adMap.channelAdMap.channel) {
          adMap.channelAdMap.channel = [];
        }

        adMap.channelAdMap.channel.push({
          slotId: newAdSlot.placementName,
          placementName: newAdSlot.placementName,
          targeting: newAdSlot.targeting,
          callback: newAdSlot.onNewAdSlotsHook
        })

        return  adMap
      }
      adMap.nonChannelAds.push({
        slotId: newAdSlot.placementName,
        placementName: newAdSlot.placementName,
        targeting: newAdSlot.targeting,
        callback: newAdSlot.onNewAdSlotsHook
      })
      return adMap
    }, {
      channelAdMap: {},
      nonChannelAds: [],
      directGamAds: []
    })
    return adMap
  }

  newPubfigAdSlots(channel, placements) {

    window.freestar.queue.push(async () => {
      window.freestar.newAdSlots(placements, channel)
      placements.forEach( (placement) => {
        if (placement.callback){
          placement.callback(placement.placementName)
        }
      })
    })
  }
  newDirectGAMAdSlots(ads) {
    window.freestar.queue.push(async () => {
      const adSlots = []
      ads.forEach( (ad) => {
        let adSlot = window.googletag.defineSlot(ad.adUnitPath, ad.slotSize, ad.placementName).addService(window.googletag.pubads())

        if (ad.sizeMappings) {
          const sizeMappingArray = ad.sizeMappings
            .reduce((mapping, size) => {
              return mapping.addSize(size.viewport, size.slot)
            }, window.googletag.sizeMapping())
            .build()
          adSlot.defineSizeMapping(sizeMappingArray)

        }

        if (ad.targeting) {
          Object.entries(ad.targeting).forEach(entry => {
            const [key, value] = entry;
            adSlot.setTargeting(key, value);
          })
        }

        window.googletag.display(adSlot)

        adSlots.push(adSlot)
        this.adSlotsMap[adSlot.getAdUnitPath()] = adSlot


      })
      window.googletag.pubads().refresh(adSlots)
      ads.forEach( (ad) => {
        if (ad.onNewAdSlotsHook){
          ad.onNewAdSlotsHook(ad.placementName)
        }
      })
    })
  }

  newAdSlot (placementName, onNewAdSlotsHook, channel, targeting, adUnitPath, slotSize, sizeMappings) {
    if (this.queue) {
      this.queueNewAdSlot(placementName,onNewAdSlotsHook, channel, targeting, adUnitPath, slotSize, sizeMappings)
    } else {
      window.freestar.queue.push(() => {
        if (!adUnitPath) {
          this.newPubfigAdSlots(channel, [{
            slotId: placementName,
            placementName: placementName,
            targeting
          }])
        } else {
          this.newDirectGAMAdSlots([{adUnitPath, slotSize, placementName, sizeMappings, targeting}])
        }
      })
    }
  }

  deleteAdSlot (placementName, targeting, onDeleteAdSlotsHook, adUnitPath) {
    window.freestar.queue.push(async () => {
      if(!adUnitPath){
        placementName = await this.getMappedPlacementName(placementName, targeting)
        window.freestar.deleteAdSlots({ placementName })
      }
      else {
        window.googletag.destroySlots([this.adSlotsMap[adUnitPath]])
      }
      if (onDeleteAdSlotsHook) {
        onDeleteAdSlotsHook(placementName)
      }
    })
  }

  refreshAdSlot (placementName, targeting, onAdRefreshHook, adUnitPath) {
    window.freestar.queue.push(async() => {
      if(!adUnitPath){
        placementName = await this.getMappedPlacementName(placementName, targeting)
        window.freestar.freestarReloadAdSlot(placementName)
      }
      else {
        window.googletag.pubads().refresh([this.adSlotsMap[adUnitPath]])
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

  trackPageview () {
    window.freestar = window.freestar || {}
    window.freestar.queue =  window.freestar.queue || []
    window.freestar.queue.push(() => {
      window.freestar.trackPageview();
    })
  }
  
  queueAdCalls (queue = false) {
    if (queue == false && this.queue == true){
      this.flushQueuedNewAdSlots()
    }
    this.queue = queue
  }
}

const Freestar = new FreestarWrapper()

export default Freestar
