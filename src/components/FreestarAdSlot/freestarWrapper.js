
class FreestarWrapper {

  constructor() {
    this.loaded = false;
  }
  get freestar() {
    return this._freestar;
  }

  get googletag() {
    return this._googletag;
  }

  load(publisher) {
    if (this.loaded === false){
      this.loaded = true;
      const qa = window.location.search.indexOf('fsdebug') > -1 ? '/qa' : ''
      const url = `https://a.pub.network/${publisher}${qa}/pubfig.min.js`
      window.freestar = window.freestar || {}
      window.freestar.hitTime = Date.now()
      window.freestar.queue =  window.freestar.queue || []
      window.freestar.config =  window.freestar.config || {}
      window.freestar.config.enabled_slots = window.freestar.config.enabled_slots || [];
      const script = document.createElement('script')
      script.src = url
      script.async = true
      document.body.appendChild(script)
    }

  }
  newAdSlot( placementName, onNewAdSlotsHook, channel, targeting) {
    window.freestar.queue.push(() => {
      window.freestar.newAdSlots({
        slotId: placementName,
        placementName,
        targeting
      }, channel)
      if (onNewAdSlotsHook)
        onNewAdSlotsHook(placementName)
    })

  }
  deleteAdSlot( placementName, onDeleteAdSlotsHook) {
    window.freestar.queue.push(() => {
      window.freestar.deleteAdSlots({ placementName })
      if ( onDeleteAdSlotsHook )
        onDeleteAdSlotsHook(placementName)
    })
  }

  setPageTargeting( key, value) {
    window.freestar = window.freestar || {};
    window.freestar.queue =  window.freestar.queue || []
    window.freestar.queue.push(() => {
      window.googletag.pubads().setTargeting(key, value)
    })
  }

  clearPageTargeting( key ) {
    window.freestar = window.freestar || {}
    window.freestar.queue =  window.freestar.queue || []
    window.freestar.queue.push(() => {
      if (key)
        window.googletag.pubads().clearTargeting(key)
      else
        window.googletag.pubads().clearTargeting()
    })
  }
}

const Freestar = new FreestarWrapper()

export default Freestar;
