
# Ironsworn and Starforged for Foundry VTT

![Download count of latest release](https://img.shields.io/github/downloads/ben/foundry-ironsworn/latest/total)
![Forge Installs](https://img.shields.io/badge/dynamic/json?label=Forge%20Installs&query=package.installs&suffix=%25&url=https%3A%2F%2Fforge-vtt.com%2Fapi%2Fbazaar%2Fpackage%2Ffoundry-ironsworn)

This is a Foundry VTT implementation of the [**Ironsworn**](https://www.ironswornrpg.com/products-ironsworn), [**Ironsworn: Delve**](https://www.ironswornrpg.com/product-ironsworn-delve), and [**Ironsworn: Starforged**](https://getstarforged.com) games by Shawn Tomkin.

To install it, just search for "ironsworn" in the system-installation UI, or use this URL:

```
https://github.com/ben/foundry-ironsworn/releases/latest/download/system.json
```

# How to play

When you first open a world with the system, you will be prompted to make a few choices.
This allows you to mix and match the Ironsworn and Starforged materials, but if you only know one ruleset, it's best to choose all one flavor to begin with.

Once you've chosen a ruleset, see below for how to get started.

## Getting started with Ironsworn
First, you'll need a map of the Ironlands.
Open the "Compendium Packs" tab on the sidebar, and look for "Ironsworn Maps" near the bottom.
Drag one of those to the "Scenes" tab in the sidebar, and activate it.
(You can also use your own, if you like.)

Next, you'll need a character.
Open up the actors tab, and hit "Create Actor".
Use the "✎ Edit" button in the title bar to adjust your stats.
Use the buttons on the sheet to add assets, vows and other progress items, or select one of the foes from the book.
Use the row of hexes to set the rank of vows and progress, and the `▸` button to mark progress.

![Ironsworn character sheet](https://user-images.githubusercontent.com/39902/167313766-fbfad416-4000-4f2f-95c0-3caa620b7319.jpg)

If you're playing with a friend or two, there's a "Shared Sheet" actor type that's made for that.
If you're playing with the Delve rules, you can use the "Site" actor type to track a location; use the buttons to open up the theme and domain compendia.

![Delve and shared sheet](https://user-images.githubusercontent.com/39902/167313863-46eb5b32-0828-402d-9240-b077abdcb79a.jpg)


Now you're ready to create vows, embark on journeys, and slay beasts.
Keep track of your story using journal entries.

The tall, narrow sheet is where you can find moves and oracles to help you on your quest.
Click the "die" icon for an assisted roll on any move or oracle.
The search box can be used to find a move or oracle by name.


## Getting started with Starforged

To generate a sector, you'll need what Foundry refers to as a "Scene."
Open the "Compendium Packs" tab in the sidebar, and look for the "Starforged Scenes" pack near the bottom. Drag a sector into the "Scenes" tab in the sidebar, and activate it.

To add locations to your sector, use the 🚀 button in the toolbox on the left-hand side of the Foundry window. There you'll find tools for adding planets, stars, settlements, derelicts, and vaults.

![Starforged locations](https://user-images.githubusercontent.com/39902/167314419-32bbe6d0-f94f-4715-93b9-6f9efd5afbe4.jpg)

Next you'll need a character.
Open up the actors tab, and hit "Create Actor".
Use the "✎ Edit" button in the title bar to adjust your stats.
Use the buttons on the sheet to add assets, vows and other progress items, or select one of the foes from the book.
Use the row of hexes to set the rank of vows and progress, and the `▸` button to mark progress.

![Starforged character sheet](https://user-images.githubusercontent.com/39902/167314525-a2c0924e-79d8-4f4f-91e5-e2dedcfa2241.jpg)

The tall, narrow sheet is where you can find moves and oracles to help you on your quest.
Click the "die" icon for an assisted roll on any move or oracle.
The search box can be used to find a move or oracle by name.

# Extensibility

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

**Custom moves** can be added in similar ways.
They must be placed in an item folder called "Custom Moves" (translated), and regardless of the structure inside, they will show up in a "Custom Moves" section of the move sheet.

There is also an `ironswornMoves` hook, which passes the final tree before display.
See `custommoves.ts` for the structure of those objects.

# System Development

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

# Credits

This work is based on Ironsworn (found at www.ironswornrpg.com), created by Shawn Tomkin, and licensed for our use under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International license  (creativecommons.org/licenses/by-nc-sa/4.0/).

Hand-drawn map scene courtesy of [McSekcer](https://www.reddit.com/user/McSekcer/).

Starforged scenes courtesy of [Unsplash](https://unsplash.com), and used under their [license](https://unsplash.com/license).
