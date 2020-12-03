class FreestarWrapper {

  constructor () {
    window.freestarReactCompontentLoaded = window.freestarReactCompontentLoaded || false
    this.loaded = window.freestarReactCompontentLoaded
  }
  log (level, ...msg)  {
    let title = 'Pubfig React Plugin ', styles = 'background: #00C389; color: #fff; border-radius: 3px; padding: 3px'
    if (freestar.debug >= level) {
      console.info(`%c${title}`, styles, ...msg);
    }
  }
  load (publisher) {
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

  newAdSlot (placementName, onNewAdSlotsHook, channel, targeting) {
    window.freestar.queue.push(() => {
      window.freestar.newAdSlots({
        slotId: placementName,
        placementName,
        targeting
      }, channel)
      if (onNewAdSlotsHook) {
        onNewAdSlotsHook(placementName)
      }
    })

  }

  deleteAdSlot (placementName, onDeleteAdSlotsHook) {
    window.freestar.queue.push(() => {
      window.freestar.deleteAdSlots({ placementName })
      if (onDeleteAdSlotsHook) {
        onDeleteAdSlotsHook(placementName)
      }
    })
  }

  refreshAdSlot (placementName, onAdRefreshHook) {
    window.freestar.queue.push(() => {
      window.freestar.freestarReloadAdSlot(placementName)
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
