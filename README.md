# Freestar Pubfig Ad Slot React Component

## NOTE: As of v1.1, the prerequisite of the core Pubfig code loaded in the HEAD is no longer required.

### Install

```sh
npm install --save @freestar/pubfig-adslot-react-component
```

### Usage

```js
import React, { Component } from 'react'

import FreestarAdSlot from '@freestar/pubfig-adslot-react-component'

import './demo.css'

class Demo extends Component {
  render() {
    const placementName = 'PublisherName_970x250_728x90_320x50'
    const slotId = 'in_content_ad_1'
    const publisher = 'publisherName'
    const targeting = { key1: 'value1', key2: 'value2' }
    const { adRefresh } = this.state
    
    return (
      <div>
        <FreestarAdSlot
          publisher={publisher}
          placementName={placementName}
          slotId={slotId}
          targeting={targeting}
          channel='custom_channel'
          classList={['m-30', 'p-15', 'b-thin-red']}
          onNewAdSlotsHook={(placementName) => console.log('creating ad', placementName)}
          onDeleteAdSlotsHook={(placementName) => console.log('destroying ad', placementName)}
          onAdRefreshHook={(placementName) => console.log('refreshing ad', placementName)}
        />
        <button onClick={this.onAdRefresh}>Trigger Refresh</button>
      </div>
    )
  }
}

export default Demo
```

### Props

**publisher**
A *required* string of the publisher, which will be provided by Freestar.

**placementName**
A *required* string of the ad unit placement, which will be provided by Freestar.

**slotId**
An *optional* string to specific the element id of the containing div around the adslot. Defaults to the placement. 

**targeting**
An *optional* object of key/value pairs for targeting.

**channel**
An *optional* string of a custom channel to use.

**classList**
An *optional* array of strings representing any additional classes that should be applied to the wrapper dom element of the ad slot.

**adRefresh**
An *optional* number bound to the ad refresh. Increment this value to trigger a refresh of the ad slot. Please consult your Freestar support team for more information.

**onNewAdSlotsHook**
An *optional* event hook that returns the `placementName` when the component **mounts** and an ad is requested.

**onDeleteAdSlotsHook**
An *optional* event hook that returns the `placementName` when the component **unmounts**.

**onAdRefreshHook**
An *optional* event hook that returns the `placementName` when the component refreshes an ad.

**integrity**
An *optional* attribute that when passed enables SRI for our pubfig library. The component will use this value for the integrity attribute when loading pubfig 
### API Methods

**FreestarAdSlot.setPageTargeting**
Proxy for the GPT setTargeting call to set page level targeting. See [GPT documentation](https://developers.google.com/doubleclick-gpt/reference#googletag.PubAdsService_setTargeting) for more details

**FreestarAdSlot.clearPageTargeting**
Proxy for the GRP clearTargeting call to clear page level targeting. See [GPT documentation](https://developers.google.com/doubleclick-gpt/reference#googletag.PubAdsService_clearTargeting) for more details

**FreestarAdSlot.trackPageView**
Proxy for the freestar.trackPageview() method.

Freestar collects data values such as url location which is then used in various tables. In order to properly track data sites that are using Single Page Applications (SPAs), or sites with slideshows/carousels that change urls/url parameters these new actions must be taken by the publisher to assure accuracy of the collected data. When the location and/or url is updated the lifecycle of the DOM and/or Window does not reload the pubfig.js script. In order to address this the publisher must invoke the freestar.trackPageview() method. This will ensure that the new url is stored and used throughout the data collection for that page or view. 

### Glossary

**placementName**
A value acquired from Google Ad Manager (previously known as DFP/Adx), which will be provided by Freestar.

**targeting**
A set of targeting values for the ad unit placement. See [GPT Documentation](https://developers.google.com/doubleclick-gpt/guides/key-value-targeting) for more details

### Bypassing Freestar Ad Placements
If you would like to bypass Freestar Ad placements and render GAM ad units yourself directly please follow the instructions [here](README-BYPASS.md)

### Queuing Freestar Ad Placements
If you would like to allow the freestar library to preload but need to hold of on ad delivery until buisness logic has completed please follow the instructions [here](README-QUEUE.md)
### Releasing a new version to npm

This package is published to npm as `@freestar/pubfig-adslot-react-component` under the shared `freestar_engineering` account.

#### Prerequisites (one-time setup)

1. Log in to npm under the shared account:
   ```sh
   npm login
   ```
   You will receive a one-time password via email at the `freestar_engineering` mailbox. Use it to complete login.

2. Confirm you have publish access to the `@freestar` scope:
   ```sh
   npm access list packages | grep pubfig-adslot
   ```
   The line for `@freestar/pubfig-adslot-react-component` must show `read-write`. If it does not, ask an `@freestar` org admin to add you.

#### Release flow

1. Open a pull request with your changes against `master`.
2. Once approved, merge into `master` and pull locally:
   ```sh
   git checkout master
   git pull origin master
   ```
3. Reinstall dependencies and rebuild from a clean state:
   ```sh
   rm -rf node_modules
   npm install
   npm run build
   ```
4. Bump the version, generate the local commit and tag:
   ```sh
   npm version patch -m "%s"
   # use `minor` or `major` instead of `patch` if appropriate
   ```
5. Rebuild against the bumped version:
   ```sh
   npm run build
   ```
6. Publish to npm (see "2FA gotcha" below before running):
   ```sh
   npm publish
   ```
7. Push the version commit and the new tag to GitHub:
   ```sh
   git push origin master --follow-tags
   ```
8. Create a GitHub Release from the new tag:
   - Open `https://github.com/freestarcapital/pubfig-adslot-react-component/releases/tag/vX.Y.Z`
   - Click "Create release from tag"
   - Title: `vX.Y.Z`. Mark "Set as the latest release". Publish.
9. Verify the publish succeeded:
   ```sh
   npm view @freestar/pubfig-adslot-react-component version
   ```
   Should print the version you just released.

#### 2FA gotcha and how to bypass it

The `@freestar` npm organization enforces 2FA for writes. The `freestar_engineering` account is configured to send a one-time password via email **only for login**, not for publish operations. As a result, `npm publish` fails with HTTP 403:

```
npm error 403 Forbidden ... Two-factor authentication or granular access token with bypass 2fa enabled is required to publish packages.
```

The current npm CLI does not prompt for an OTP in this flow, and `np` (referenced in older docs) inherits the same problem. The reliable workaround is to use a **granular access token with 2FA bypass enabled**:

1. Log in to `https://www.npmjs.com` as `freestar_engineering`.
2. Go to "Access Tokens" -> "Generate New Token" -> "Granular Access Token".
3. Configure:
   - **Token name:** anything descriptive (e.g. `pubfig-adslot-react-publish`)
   - **Expiration:** 30 days (renew as needed)
   - **Packages and scopes - Permissions:** Read and write
   - **Packages and scopes - Selection:** `@freestar/pubfig-adslot-react-component` (or the full `@freestar` scope)
   - **Bypass 2FA for this token:** enabled
4. Generate and copy the token (shown only once). It starts with `npm_`.
5. Configure npm to use the token locally:
   ```sh
   npm config set //registry.npmjs.org/:_authToken=npm_xxxxxxxxxxxxxxxxxxxxxx
   ```
6. Run `npm publish`. It will succeed without an OTP prompt.

#### Cleanup after publishing

Once the release is live, remove the token from your local config:

```sh
npm config delete //registry.npmjs.org/:_authToken
```

Optionally also revoke the token at `https://www.npmjs.com/settings/freestar_engineering/tokens`.

