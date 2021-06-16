# Ironsworn for Foundry VTT

This is an implementation of the [Ironsworn](https://www.ironswornrpg.com/) rule set for Foundry VTT.

![Screenshot, also showing Dice so Nice](https://user-images.githubusercontent.com/39902/121752524-2b5fd180-cac5-11eb-8a1e-56523bef1a70.jpg)

To install it, plug this URL into the install UI:

```
https://raw.githubusercontent.com/ben/foundry-ironsworn/main/system/system.json
```

## How to use this

Open up the "Ironsworn Maps" compendium, and drag one of the scenes into the scene tab.
You can mark it up using the drawing tools.

Create a new character, and customize the name and stats.
Assets are in their own compendium, drag them onto your character sheet.

Now you're ready to create vows, embark on journeys, and slay beasts.
Keep track of your story using journal entries.

## How to hack on this

1. Install Foundry 0.8 or later, and start it up.
2. Install the main `foundry-ironsworn` system, and create a world that uses it.
3. Clone this repo somewhere you can find it, and run `npm install`.
4. Run `npm start` from this repository.
5. Open a browser to http://localhost:8080.

When you use that browser window, webpack will serve up freshly-built assets instead of the ones in the installed version of the system.
Just remember to reload your browser window when you make a change.

## Ironsworn

This work is based on Ironsworn (found at www.ironswornrpg.com), created by Shawn Tomkin, and licensed for our use under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International license  (creativecommons.org/licenses/by-nc-sa/4.0/).
