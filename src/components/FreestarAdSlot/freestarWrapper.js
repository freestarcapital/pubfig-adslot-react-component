class FreestarWrapper {

  init(publisher) {
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
    }
  }
  log (level, ...msg)  {
    let title = 'Pubfig React Plugin ', styles = 'background: #00C389; color: #fff; border-radius: 3px; padding: 3px'
    if (this.logEnabled) {
      console.info(`%c${title}`, styles, ...msg)
    }
  }
  newAdSlot (placementName, onNewAdSlotsHook, channel, targeting, adUnitPath, slotSize, sizeMappings) {
    window.freestar.queue.push(() => {
      let adSlot;
      if (!adUnitPath) {
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
        window.googletag.pubads().refresh(adSlot)

      }
      if (onNewAdSlotsHook) {
        onNewAdSlotsHook(placementName)
      }
      return adSlot
    })

  }

  deleteAdSlot (placementName, onDeleteAdSlotsHook, adSlot) {
    window.freestar.queue.push(() => {
      if(!adSlot){
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

  refreshAdSlot (placementName, onAdRefreshHook, adSlot) {
    window.freestar.queue.push(() => {
      if(!adSlot){
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
  }
}

const Freestar = new FreestarWrapper()

export default Freestar
