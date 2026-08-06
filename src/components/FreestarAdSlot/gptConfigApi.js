/**
 * GPT config-API compatibility layer.
 *
 * This component does not control the load order of gpt.js on the page. A
 * non-Freestar, older, or cached gpt.js can own the shared `window.googletag`
 * global, and that gpt.js has no `setConfig`/`getConfig` — calling it throws
 * `TypeError: ... is not a function`. Every one of our config-API calls happens
 * inside a `window.freestar.queue` callback, so the throw kills the rest of that
 * callback: in `newDirectGAMAdSlots` the slot never reaches `display()`, never
 * lands in the refresh array, and the `onNewAdSlotsHook` never fires.
 *
 * Each helper feature-detects the config API and otherwise routes to the legacy
 * `pubads()`/slot targeting API, which has existed for the lifetime of GPT and
 * is safe to assume when any gpt.js is present. Nothing here throws when the
 * API surface is missing — it falls back or no-ops.
 *
 * Ported from pubfig.js `src/core/base/gam/configApi.js`; only the helpers this
 * component actually calls are included.
 */

const supportsConfigSetter = (gpt) => typeof gpt?.setConfig === 'function'
const pubadsOf = (gpt) => (typeof gpt?.pubads === 'function' ? gpt.pubads() : null)

/** GPT targeting values must be a string or an array of strings. */
const normalize = (value) => (Array.isArray(value) ? value.map(String) : String(value))

/**
 * Set slot-level targeting. Accepts either a single key/value pair or a full
 * targeting map (object). Falls back to the legacy `slot.setTargeting` when the
 * slot lacks the config API — so KVPs are still applied, not silently dropped.
 */
export const setSlotTargeting = ({ slot, key, value }) => {
  if (!slot || value == null) return

  let map
  if (key) {
    map = { [key]: normalize(value) }
  } else if (typeof value === 'object' && !Array.isArray(value)) {
    map = Object.fromEntries(Object.entries(value).map(([k, v]) => [k, normalize(v)]))
  } else {
    return
  }

  if (supportsConfigSetter(slot)) {
    slot.setConfig({ targeting: map })
    return
  }
  if (typeof slot.setTargeting === 'function') {
    Object.entries(map).forEach(([k, v]) => slot.setTargeting(k, v))
  }
}

/** Set one page-level (global) targeting key. */
export const setPageTargeting = ({ gpt, key, value }) => {
  const normalized = normalize(value)
  if (supportsConfigSetter(gpt)) {
    gpt.setConfig({ targeting: { [key]: normalized } })
    return
  }
  pubadsOf(gpt)?.setTargeting(key, normalized)
}

/** Clear one page-level targeting key, or all of them when `key` is omitted. */
export const clearPageTargeting = ({ gpt, key }) => {
  if (supportsConfigSetter(gpt)) {
    gpt.setConfig({ targeting: key ? { [key]: null } : null })
    return
  }
  const pubads = pubadsOf(gpt)
  if (!pubads) return
  if (key) {
    pubads.clearTargeting(key)
  } else {
    pubads.clearTargeting()
  }
}
