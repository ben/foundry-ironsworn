![Download count of latest release](https://img.shields.io/github/downloads/ben/foundry-ironsworn/latest/total)
![Forge Installs](https://img.shields.io/badge/dynamic/json?label=Forge%20Installs&query=package.installs&suffix=%25&url=https%3A%2F%2Fforge-vtt.com%2Fapi%2Fbazaar%2Fpackage%2Ffoundry-ironsworn)

# Ironsworn for Foundry VTT

This is a Foundry VTT implementation of the **Ironsworn** and **Ironsworn Delve** rule sets by [Shawn Tomkin](https://www.ironswornrpg.com).


![Screenshot](https://user-images.githubusercontent.com/39902/126507113-139e395e-304d-440e-80f4-6d4eb87cd1a2.png)

To install it, just search for "ironsworn" in the system-installation UI, or use this URL:

```
https://github.com/ben/foundry-ironsworn/releases/latest/download/system.json
```

## How to Play
First, you'll need a world map.
Several are provided in the "Ironsworn Maps" compendium, or you can make your own.

Next, you'll need a character.
Open up the actors tab, and hit "Create Actor".
Use the "✎ Edit" button in the title bar to adjust your stats.
Assets can be dragged onto the sheet.
The core assets are provided in the "Ironsworn Assets" compendium, or you can create your own.
Use the row of hexes to set the rank of vows and progress, and the `▸` button to mark progress.

![Delve and shared sheet](https://user-images.githubusercontent.com/39902/126508523-fd9016ef-2206-476b-80a8-c29a99313239.png)

If you're playing with a friend or two, there's a "Shared Sheet" actor type that's made for that.

If you're playing with the Delve rules, you can use the "Site" actor type to track a location.
Use the buttons to open up the theme and domain compendia, or you can create your own.

Create a new character, and customize the name and stats.
Assets are in their own compendium, drag them onto your character sheet.

Now you're ready to create vows, embark on journeys, and slay beasts.
Keep track of your story using journal entries.

## Extensibility

**Custom oracles** can be added in one of two ways.
The first is by creating a table folder called "Custom Oracles" (this name may be translated).
Whatever folder and table structure is found there will be mirrored into the oracle sidebar.

The second is more useful for modules, and involves intercepting the `ironswornOracles` hook.
The type of object in the tree is shown in `customoracles.ts`.
Here's a simple hoook that adds more rows to the "Background Assets" oracle:

```js
Hooks.on('ironswornOracles', (root) => {
  root.children[0].children[0].tables.push(game.tables.get('MSjHr7AahxxJXAqe'))
})
```

## How to hack on this

1. Install Foundry 0.8.8 or later, and start it up.
2. Install the main `foundry-ironsworn` system, and create a world that uses it.
3. Clone this repo somewhere you can find it, and run `npm install`.
4. Run `npm start` from this repository.
5. Open a browser to http://localhost:8080.

When you use that browser window, webpack will serve up freshly-built assets instead of the ones in the installed version of the system.
Some things to remember:

* Only the Javascript and stylesheets are served up by Webpack. If you change anything else, you'll want to do something like this before reloading:
  ```
  cp -R system/* ~/Library/Application\ Support/FoundryVTT/Data/systems/foundry-ironsworn/
  ```
* If you make a change to `system.json` or any of the I18n files, you'll have to return to setup, use the command above, and start the world up again.
* If you change any of the `*.hbs` templates, use the command above before reloading your browser window.
* Any Typescript or LESS changes only require a browser reload.

## Credits

This work is based on Ironsworn (found at www.ironswornrpg.com), created by Shawn Tomkin, and licensed for our use under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International license  (creativecommons.org/licenses/by-nc-sa/4.0/).

Hand-drawn map scene courtesy of [McSekcer](https://www.reddit.com/user/McSekcer/).

Starforged scenes courtesy of [Unsplash](https://unsplash.com), and used under their [license](https://unsplash.com/license).
