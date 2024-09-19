# Ironsworn and Starforged for Foundry VTT

![Download count of latest release](https://img.shields.io/github/downloads/ben/foundry-ironsworn/latest/ironsworn.zip?style=for-the-badge)
[![Forge Installs](https://img.shields.io/badge/dynamic/json?label=Forge%20Installs&query=package.installs&suffix=%25&url=https%3A%2F%2Fforge-vtt.com%2Fapi%2Fbazaar%2Fpackage%2Ffoundry-ironsworn&style=for-the-badge)](https://forge-vtt.com/bazaar/package/foundry-ironsworn)

This is a Foundry VTT implementation of the [**Ironsworn**](https://tomkinpress.com/pages/ironsworn), [**Ironsworn: Delve**](https://tomkinpress.com/pages/ironsworn-delve), [**Ironsworn: Starforged**](https://tomkinpress.com/pages/ironsworn-starforged), and [**Sundered Isles**](https://tomkinpress.com/pages/sundered-isles) games by Shawn Tomkin.

To install it, just search for "ironsworn" in the system-installation UI, or use this URL:

```
https://github.com/ben/foundry-ironsworn/releases/latest/download/system.json
```

For information on how to play a game, check out [the wiki](https://github.com/ben/foundry-ironsworn/wiki/Getting-Started).

# System Development

> [!IMPORTANT]
> Currently you **must** have [Datasworn](https://github.com/rsek/datasworn/tree/v0.1.0) checked out to the `v0.1.0` branch in the same directory as this repo in order for the build to succeed.
> I don't like it either, and as soon as there's an NPM release, I'll fix it and remove this note.

Here's what you'll need to make changes to this system:

1. Install Foundry 11 or later, and start it up.
2. Install the main `foundry-ironsworn` system, and create a world that uses it.
3. Clone this repo somewhere you can find it, and run `npm install`.
4. Run `npm start` from this repository.
5. Open a browser to http://localhost:8080.

When you use that browser window, Vite will serve up freshly-built assets instead of the ones in the installed version of the system, and will do browser-window refreshes for you in many cases.
Some things to remember:

- Only the Javascript and stylesheets are served up by Vite. If you change anything else (like a `.hbs` file), you'll want to do something like this before reloading:
  ```
  cp -R system/* ~/Library/Application\ Support/FoundryVTT/Data/systems/foundry-ironsworn/
  ```
- If you make a change to `system.json` or any of the I18n files, you'll have to return to setup, use the command above, and start the world up again.
- [Vue Inspector](https://github.com/webfansplz/vite-plugin-vue-inspector) is configured, so tap alt+shift (cmd+shift on Mac) and click on a Vue element to open the relevant file in VS Code.

# Credits


This work is based on several works created by Shawn Tomkin, and are licensed under the [CC-BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/4.0/) license, as detailed at https://tomkinpress.com/pages/licensing.

Data courtesy of [Datasworn](https://github.com/rsek/datasworn), which is used here under its MIT license.

Hand-drawn map scene courtesy of [McSekcer](https://www.reddit.com/user/McSekcer/).

Starforged scenes courtesy of [Unsplash](https://unsplash.com), and used under their [license](https://unsplash.com/license).

Ocean scenes courtesy of [@AuguestBebel](https://github.com/AugustBebel) (https://github.com/ben/foundry-ironsworn/pull/993).

Extra location icons courtesy of [Eric Rains and Kirin](https://github.com/ben/foundry-ironsworn/pull/485).
