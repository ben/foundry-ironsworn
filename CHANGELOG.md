# Changelog

## Next Release

- Improve appearance of v11 compendium sidebar and popouts with the "Phosphor" theme
- Under the hood: refactor all `RollTable`s and oracle rolls to use a single standardized pipeline (with `foundry-ironsworn`-style table roll messages) by default; certain kinds of results will fall back to FVTT-style messages instead.
- Include most of Starforged's oracle icons in the `foundry-ironsworn/assets` directory -- use them as symbolic tokens, map pins, etc

## 1.21.7

- The system is now officially compatible with v10 and v11 ([#772](https://github.com/ben/foundry-ironsworn/pull/772))
- Expand Spanish translation to be on par with the English language file ([#749](https://github.com/ben/foundry-ironsworn/pull/749), thanks [@erizocosmico](https://github.com/erizocosmico)!)
- Improved dropdown menu styling for the "Phosphor" colorway
- Fix some warnings and errors when running under v11 ([#772](https://github.com/ben/foundry-ironsworn/pull/772))

## 1.21.6

- Fix a bug that caused an exception when creating a custom delve theme

## 1.21.5

- Bump dataforged, and fix the link to the _Find an Opportunity_ oracle ([#735](https://github.com/ben/foundry-ironsworn/pull/735))

## 1.21.4

- Allow custom images for assets and moves ([#734](https://github.com/ben/foundry-ironsworn/pull/734))
- Under the hood: dependency updates and refactoring

## 1.21.3

- Fix a race condition in the location sheet, where sometimes the chat message and the text pasted into the description were different

## 1.21.2

- Fix drag-and-drop of items from chat messages

## 1.21.1

## 1.21.0

- Added a new method of customizing oracles, which should work better for larger projects like Ironsmith ([#686](https://github.com/ben/foundry-ironsworn/pull/696))
- Drop the custom font ([#702](https://github.com/ben/foundry-ironsworn/pull/702))
- Fix a tooltip bug on the edit-sector button
- Fixed bug with growth behaviour of player asset list ([#700](https://github.com/ben/foundry-ironsworn/pull/700))
- Fixed bug with Starforged asset decoration; it should now switch with the game theme as intended ([#700](https://github.com/ben/foundry-ironsworn/pull/700))

## 1.20.30

- Color scheme and decoration theme are now separate settings, and changing the color theme no longer requires a restart ([#695](https://github.com/ben/foundry-ironsworn/pull/695#pullrequestreview-1350439536))
- Disable chat-message copy buttons (and add a tooltip) if access to the clipboard is restricted ([#678](https://github.com/ben/foundry-ironsworn/pull/678))
- Better condition checkboxes ([#684](https://github.com/ben/foundry-ironsworn/pull/684))
- Under the hood:
  - The last remnants of the Handlebars sheets have been swept away ([#676](https://github.com/ben/foundry-ironsworn/pull/676) and [#677](https://github.com/ben/foundry-ironsworn/pull/677))
  - Challenge ranks are now stored numerically ([#688](https://github.com/ben/foundry-ironsworn/pull/688))
  - Improvements to the way asset controls are done ([#685](https://github.com/ben/foundry-ironsworn/pull/685), [#686](https://github.com/ben/foundry-ironsworn/pull/686), [#687](https://github.com/ben/foundry-ironsworn/pull/687))
  - Begin a migration to SASS for styles ([#683](https://github.com/ben/foundry-ironsworn/pull/683))
  - Dependency updates and code style ([#682](https://github.com/ben/foundry-ironsworn/pull/682))
  - Fixed a problem that prevented installation under the Foundry v11dev1

## 1.20.29

- Update move-sheet aesthetics to reduce the use of color a bit ([#672](https://github.com/ben/foundry-ironsworn/pull/672))
- Fix SVG sizes in Firefox ([#663](https://github.com/ben/foundry-ironsworn/pull/663))
- Under the hood: updated dependencies and node configs ([#664](https://github.com/ben/foundry-ironsworn/pull/664), [#673](https://github.com/ben/foundry-ironsworn/pull/673))
- Under the hood: streamlined the CSS process and reduced the output file size by half ([#675](https://github.com/ben/foundry-ironsworn/pull/675))

## 1.20.28

- Fix scrollbar width styling
- Disable custom colors for volume sliders in Starforged theme, they were invisible

## 1.20.27

- Updated français translations ([#656](https://github.com/ben/foundry-ironsworn/pull/656))
- Fix: changing the _default_ character sheet now also updates move sheets

## 1.20.26

- Fix: changing a character's sheet now properly updates their move sheet
- Tours: the "welcome" tour now skips the 5th step if there's no scene, avoiding a dangling ending.
- Tours: add a tour for the Ironsworn character sheet ([#657](https://github.com/ben/foundry-ironsworn/pull/657))

## 1.20.25

- Fix the names of new non-PC actors

## 1.20.24

- Make the compact sheet resizable

## 1.20.23

- Fixed: when the Starforged theme was active, the system tour would hang on the second step.

## 1.20.22

- Fix some bugs around move-link navigation throughout the UI ([#647](https://github.com/ben/foundry-ironsworn/pull/647))
- Add a tour for the Starforged character sheet ([#648](https://github.com/ben/foundry-ironsworn/pull/648)) and one for the move sheet ([#649](https://github.com/ben/foundry-ironsworn/pull/649))

## 1.20.21

- Assets like **Bonded** with move links in their requirement fields now work properly when you click the links.
- Update the compact PC sheet, fixing visual glitches, and converting it to Vue ([#640](https://github.com/ben/foundry-ironsworn/pull/640)).
- Under the hood: refactored the Vue layer to have a more sensible architecture ([#638](https://github.com/ben/foundry-ironsworn/pull/638) and [#639](https://github.com/ben/foundry-ironsworn/pull/639)).

## 1.20.20

- Obey the Foundry default-token settings for disposition and name display
- Only randomize location "kind" and name if they're not already set

## 1.20.19

- Fix: the "Launch tour" button in the chat message works now 😳
- Under the hood: using Foundry v10 uuids more than id/pack pairs ([#629](https://github.com/ben/foundry-ironsworn/pull/629) and [#630](https://github.com/ben/foundry-ironsworn/pull/630))

## 1.20.18

- Fix some string bugs in the sector and location sheets
- Add a tooltip to the sector sheet to explain what the setting is for
- Add a few Foundry tours ([#624](https://github.com/ben/foundry-ironsworn/pull/624))

## 1.20.17

- Add a "roll progress" icon to the NPC sheet ([#628](https://github.com/ben/foundry-ironsworn/pull/628))
- NPC sheet "mute" button appears if there are multiple users of any kind (also [#628](https://github.com/ben/foundry-ironsworn/pull/628))
- Fix icon paths if you have your Foundry configured with a URL prefix path ([#626](https://github.com/ben/foundry-ironsworn/pull/626))

## 1.20.16

- Fix bugs in the Starforged truths, and include the quest starters ([#627](https://github.com/ben/foundry-ironsworn/pull/627))

## 1.20.15

- Add a loading spinner for the asset browser ([#618](https://github.com/ben/foundry-ironsworn/pull/618))
- Add a "mute" toggle to the NPC sheet, so GMs can surprise the other players in the game ([#625](https://github.com/ben/foundry-ironsworn/pull/625))
- Fix some issues with the first-start-in-a-new-world experience ([#620](https://github.com/ben/foundry-ironsworn/pull/620))
- Under the hood: Remove the old `tables.db` (superceded by `ironsworn-oracles.db`) and all remaining references to it ([#614](https://github.com/ben/foundry-ironsworn/pull/614))

## 1.20.14

- Allow pre-setting of challenge dice, and revamp the advanced rolling options UI ([#606](https://github.com/ben/foundry-ironsworn/pull/606))
- Updated icons for journal links to various in-game entities ([#605](https://github.com/ben/foundry-ironsworn/pull/606))
- Pruned, updated, and reorganized many localization keys, and borrow from FVTT's own translations to reduce the work required for future translations ([#596](https://github.com/ben/foundry-ironsworn/pull/596))
- Improvements to the Polish translation ([#595](https://github.com/ben/foundry-ironsworn/pull/595))
- Under the hood: update Dataforged import with documents built in Foundry v10 ([#601](https://github.com/ben/foundry-ironsworn/pull/601))
- Under the hood: migrate Delve site denizens, features, and dangers to format consistent with `TableResult`s, which should make them easier to localize ([#605](https://github.com/ben/foundry-ironsworn/pull/606))

## 1.20.13

- Avoid overriding move names with Dataforged data, so translation modules can ship move names.

## 1.20.12

- Remove tables from roll-result chat message when there are oracle buttons

## 1.20.11

- Stop minifying for production builds

## 1.20.10

- Fix release-on-tag action

## 1.20.9

- New journal-page type: progress ([#508](https://github.com/ben/foundry-ironsworn/pull/508))

## 1.20.8

- Fix a bug where some sheets won't open
- Under the hood: dependabot enabled, and some dependencies are updated

## 1.20.7

- Fix some yucky layout in the location sheet

## 1.20.6

- There's now a button in the sidebar that opens the oracle browser as a standalone window ([#570](https://github.com/ben/foundry-ironsworn/pull/570))
- The system now includes a macros compendium ([#571](https://github.com/ben/foundry-ironsworn/pull/571))
- Setting truths are now stored as compendia, making translation efforts easier/possible. ([#564](https://github.com/ben/foundry-ironsworn/pull/564) for the data, [#569](https://github.com/ben/foundry-ironsworn/pull/569) for the new UI)
- Updates to the Starforged theme, now covers the MCE editor drop-down menus ([#557](https://github.com/ben/foundry-ironsworn/pull/557))
- Dragging from the asset browser now triggers the drop-zone animation ([#561](https://github.com/ben/foundry-ironsworn/pull/561))
- Completing the challenge-resolution dialog or the world-truths dalog now only closes that single window, instead of all Vue windows.
- Under the hood: updated NPM packages and Vite bundler ([#554](https://github.com/ben/foundry-ironsworn/pull/554) and [#555](https://github.com/ben/foundry-ironsworn/pull/555))
- Under the hood: button components refactored and simplified ([#565](https://github.com/ben/foundry-ironsworn/pull/565))

## 1.20.5

- Allow viewing of completed progress items

## 1.20.4

- Include connections in the progress lists on the shared and Ironsworn sheets

## 1.20.3

- Shared sheet notes now grow to fill their space
- Fixed some spacing and layout issues on the NPC sheet

## 1.20.2

- Updated bondset editor ([#546](https://github.com/ben/foundry-ironsworn/pull/546))
- Updated aesthetics for drop targets ([#547](https://github.com/ben/foundry-ironsworn/pull/547))
- Replace all native tooltips with Foundry enhanced ones ([#549](https://github.com/ben/foundry-ironsworn/pull/549))
- Better logic for links embedded in descriptions; clicking a move in an asset description navigates to the move, but clicking an actor link opens the actor's sheet, for instance. ([#552](https://github.com/ben/foundry-ironsworn/pull/552))
- Fix the module management dialog in the Starforged theme

## 1.20.1

- Bring back progress-item stars in the SF character sheet
- Fix a visual glitch with super-wide legacy tracks
- Further polish to CSS and the site sheet ([#543](https://github.com/ben/foundry-ironsworn/pull/543))
- Fix a style clash with Monk's Enhanced Journal ([#545](https://github.com/ben/foundry-ironsworn/pull/545))

## 1.20.0

- A new look and layout for the move sheet ([#518](https://github.com/ben/foundry-ironsworn/pull/518))
- A new layout for the site sheet, which uses the new rolling pipeline ([#533](https://github.com/ben/foundry-ironsworn/pull/533) and [#540](https://github.com/ben/foundry-ironsworn/pull/540))
- The buttons for rolling _Write Your Epilogue_ and _Locate Your Objective_ now use the new rolling pipeline, which has been augmented to support progress moves ([#536](https://github.com/ben/foundry-ironsworn/pull/536))
- Removed the old/unused "vow" and "move" item types ([#539](https://github.com/ben/foundry-ironsworn/pull/539))
- The SF _Repair_ move now displays its table

## 1.19.1

- Clicking the "roll" icon on an Ironsworn character's bonds track now uses the new rolling dialog ([#530](https://github.com/ben/foundry-ironsworn/pull/530))
- Under the hood: correct console warnings about using `thing.data`, instead using `thing.system` and other v10-friendly methods.

## 1.19.0

- Ironsworn & Starforged now requires Foundry v10
- Asset sheets: abilities can be toggled by clicking their bullets ([#532](https://github.com/ben/foundry-ironsworn/pull/532))

## 1.18.16

- Foe sheets are editable again

## 1.18.15

- Fixes the French translation

## 1.18.14

- Text edits on progress items are no longer lost when changing the rank.

## 1.18.13

- Update the asset pop-out sheet to present half-edit (which more closely matches the cards) and full-edit experiences ([#524](https://github.com/ben/foundry-ironsworn/pull/524))
- Add conditions to assets (also [#524](https://github.com/ben/foundry-ironsworn/pull/524))
- Include asset conditions in the PC-condition tooltips ([#525](https://github.com/ben/foundry-ironsworn/pull/525))

## 1.18.12

- Fix a visual bug with sliding transition groups, e.g. marking a vow as complete ([#521](https://github.com/ben/foundry-ironsworn/pull/521))
- "Battered" and "Cursed" no longer cascade across actor sheets, but those sheets will get highlights suggesting other actors that have them set ([#523](https://github.com/ben/foundry-ironsworn/pull/523))
- Location sheet name change triggers token names to change (again)

## 1.18.11

- Minor updates to layout of the progress sheet ([#520](https://github.com/ben/foundry-ironsworn/pull/520))
- Fix all the cursor-jumping issues in text editors

## 1.18.10

- Update the oracle-roll-chat-card UI with hover controls for rerolling and copying results to the clipboard ([#516](https://github.com/ben/foundry-ironsworn/pull/516))
- Updated French translations ([#519](https://github.com/ben/foundry-ironsworn/pull/519), thanks to @aldarion-jdr)
- Fix a bug with an open text editor moving the cursor around

## 1.18.9

- Add human-readable labels to the dialog when creating a new item, including a nudge away from using the old `'move'` item type ([#513](https://github.com/ben/foundry-ironsworn/pull/513))
- Show edit-mode buttons for progress items with only a clock

## 1.18.8

- Fix the "liveness" of the Foe sheet

## 1.18.6

- Fix a visual layout bug, where editors were only showing two lines of text

## 1.18.5

- Rework code that was freezing Foundry objects, causing issues with asset sheets ([#510](https://github.com/ben/foundry-ironsworn/pull/510))
  - **NOTE:** this change may break your custom move/oracle/asset hooks, check [the guide](https://github.com/ben/foundry-ironsworn/wiki/Extensibility#using-hooks) for the new format

## 1.18.4

- Progress-roll button now has the correct number of filled boxes in its tooltip
- Fix bug with setting the track value in the asset-edit sheet

## 1.18.3

- Fix system loading issue

## 1.18.2

- Updated meters and controls, with keyboard controls ([#501](https://github.com/ben/foundry-ironsworn/pull/501))

## 1.18.1

- Reinstate visibility of the description field for custom assets ([#499](https://github.com/ben/foundry-ironsworn/pull/499))

## 1.18.0

- Updated asset-selection UI, with a better browsing experience ([#488](https://github.com/ben/foundry-ironsworn/pull/488))
- Upgraded progress widgets and legacies tab ([#486](https://github.com/ben/foundry-ironsworn/pull/486))
- Updated Spanish content from the official translation ([#489](https://github.com/ben/foundry-ironsworn/pull/489))
- Added some new location icons by ErRains and KirinCorleone ([#485](https://github.com/ben/foundry-ironsworn/pull/485))
- Re-imported Starforged foe actors to fix their icon images

## 1.17.20

- Remove the window transparency in the SF theme

## 1.17.19

- Ironsworn assets are now sourced from Dataforged, fixing a number of data issues ([#483](https://github.com/ben/foundry-ironsworn/pull/483))
- Add icons to Starforged encounter items ([#478](https://github.com/ben/foundry-ironsworn/pull/478))
- Behind the scenes: record asset categories ([#481](https://github.com/ben/foundry-ironsworn/pull/481)) and colors ([#484](https://github.com/ben/foundry-ironsworn/pull/484)) to compendium items
- Add a bit of graphic flair to SF assets ([#482](https://github.com/ben/foundry-ironsworn/pull/482))

## 1.17.18

- Only show the "star" control on progresses on the Starforged sheet ([#475](https://github.com/ben/foundry-ironsworn/pull/475))
- Better choice of "Fulfill Your Vow" when rolling a vow on a shared sheet

## 1.17.17

- Fix the zero-clock bug and add tooltips to clock wedges ([#473](https://github.com/ben/foundry-ironsworn/pull/473))

## 1.17.16

- Ensure all character stats are numbers (fixes [#460](https://github.com/ben/foundry-ironsworn/pull/460))
- Add an "oracle" icon and lots of v10 tooltips ([#466](https://github.com/ben/foundry-ironsworn/pull/466))
- Use the _Fulfill Your Vow_ move when doing a progress roll on a vow ([#470](https://github.com/ben/foundry-ironsworn/pull/470))
- Update the rank pips and clock components ([#469](https://github.com/ben/foundry-ironsworn/pull/469))
- Standardize tables and rules-text displays ([#468](https://github.com/ben/foundry-ironsworn/pull/468))
- Internal cleanups and tightening of types

## 1.17.15

- Fix name randomizer for settlements

## 1.17.14

- Fix clicking links embedded in notes tabs

## 1.17.13

- Re-import Dataforged under v9 to make sure the `data` field is present

## 1.17.12

- The return of oracles in the Ironsworn move sheet ([#465](https://github.com/ben/foundry-ironsworn/pull/465))
- Normalize some labels in the SF location sheet ([#464](https://github.com/ben/foundry-ironsworn/pull/464))
- Periodically refresh document caches to prevent the garbage collector from purging them and breaking oracle rolls

## 1.17.11

- Improvements to oracles ([#463](https://github.com/ben/foundry-ironsworn/pull/463)):
  - Right-clicking on a move-result chat card will now display shortcuts for rolling oracles if any are mentioned
  - The move sheet now uses the standard oracle control for in-move oracles, which makes them more compact, and saves a click and some chat space if you just want to roll the oracle

## 1.17.10

- Fix momentum calculation

## 1.17.9

- Fix the move editor sheet

## 1.17.8

- Fix Ironsworn moves and oracles

## 1.17.7

- Starforged-theme editor color fixes
- Add a dialog for resolving a roll with extra challenge dice ([#458](https://github.com/ben/foundry-ironsworn/pull/458))

## 1.17.6

- Prevent progress tracks from having negative values
- Fix a bug when clicking a post-move oracle-roll button in the chat
- Render links in Ironsworn oracles on import

## 1.17.5

- Fix a visual glitch with the "Health" label buttons in the Ironsworn sheet.
- Fix a custom-oracles bug introduced with the new pipeline

## 1.17.4

- Fix a bug with creating duplicate folders with scene buttons in v10 ([#454](https://github.com/ben/foundry-ironsworn/pull/454))
- New oracle-rolling pipeline ([#452](https://github.com/ben/foundry-ironsworn/pull/452))

## 1.17.3

- Remove "Oracle NN:" from Ironsworn oracle names ([#453](https://github.com/ben/foundry-ironsworn/pull/453))
- Fix a visual glitch with progress tracks in v10
- Retire the classic Site sheet

## 1.17.2

- Freshen up the compact PC sheet, and use the new rolling pipeline ([#448](https://github.com/ben/foundry-ironsworn/pull/448))
- Fix a bug where clicking on a progress-item's image would change the parent actor's image
- Include "connection" items in the progress lists of shared and Ironsworn sheets
- Retire the Handlebars move/oracle sheet, in favor of the Vue one introduced in #419 ([#439](https://github.com/ben/foundry-ironsworn/pull/439))

## 1.17.1

- Make delve-site roll rendering a bit less ugly, until we can make it more pretty ([#446](https://github.com/ben/foundry-ironsworn/pull/446))

## 1.17.0

- Add a new dice-rolling engine, and upgrade the move/stat/track/progress rolling dialogs ([#422](https://github.com/ben/foundry-ironsworn/pull/422))
- Fix the die-roll backgrounds in the SF theme
- Don't open editors for non-editable items when clicking a move link and no character move sheet is open.
- Add a start for Polish translations (see [#428](https://github.com/ben/foundry-ironsworn/issues/428))
- Retire the "Classic" character ([#438](https://github.com/ben/foundry-ironsworn/pull/438)) and shared ([#440](https://github.com/ben/foundry-ironsworn/pull/440)) sheets
- Improve choice of foe compendium in the "shared" sheet ([#442](https://github.com/ben/foundry-ironsworn/pull/442))

## 1.16.9

- Fix the new-character dialog to correctly generate SF character names
- Bump dataforged to [v1.5.0](https://github.com/rsek/dataforged/releases/tag/v1.5.0) and re-import data ([#433](https://github.com/ben/foundry-ironsworn/pull/433))

## 1.16.8

- Fix the values for momentum max/reset for new characters
- Fix chat-message reroll and momentum-burn buttons for Ironsworn rolls (beta feature)

## 1.16.7

- Fix a v10 visual glitch around minimizing the move sheet
- Fix a bug with a blank SF setting-truths dialog

## 1.16.6

- Fix the first-start dialog save button ([#423](https://github.com/ben/foundry-ironsworn/pull/423))
- Move "manual" content from the readme to the [wiki](https://github.com/ben/foundry-ironsworn/wiki/Getting-Started)
- Run the "Ironsworn Startup" macro on startup, if it exists

## 1.16.5

- (v10) Fix a bug with move navigation ([#421](https://github.com/ben/foundry-ironsworn/pull/421))
- Properly announce setting and clearing of custom conditions in the chat window
- Fix selection of movesheet with combinations of Ironsworn/Starforged sheets/toolboxes and beta checkbox

## 1.16.4

- Custom conditions with custom names ([#420](https://github.com/ben/foundry-ironsworn/pull/420))

## 1.16.3

- Ironsworn sheet: completed area, and move notes to a tab ([#417](https://github.com/ben/foundry-ironsworn/pull/417))
- Import Ironsworn moves from dataforged ([#418](https://github.com/ben/foundry-ironsworn/pull/418))
- (Beta) Allow use of the new move/oracle UI for Ironsworn([#419](https://github.com/ben/foundry-ironsworn/pull/419))

## 1.16.2

- First release that fully loads under Foundry v10 ([#413](https://github.com/ben/foundry-ironsworn/pull/413))

## 1.16.1

- A small fix that should allow DF Manual Rolls to work properly (fixes [#411](https://github.com/ben/foundry-ironsworn/issues/411))

## 1.16.0

- Replace the quirky Quill editor with a Vue wrapper around Foundry's TinyMCE.
- Under-the-hood updates:
  - Code reorganization and format normalization
  - Update to the right version of the Foundry types
  - Update `system.json` to include the new v10 fields
  - Port the code to Vue3 using Vite (also [#407](https://github.com/ben/foundry-ironsworn/pull/407))

## 1.15.14

- Propagate region setting from location to scene
- SF theme: make journal editing more humane

## 1.15.13

- Rename "Foe" to "NPC" in new-actor dialog
- Avoid showing the "Housekeeping" warnings when first starting a new world
- Quick fix for tiny editor black-on-black problem

## 1.15.12

- Bump Dataforged and import new Sundered Isles assets ([#378](https://github.com/ben/foundry-ironsworn/pull/378))
- Rework click areas for SF moves ([#379](https://github.com/ben/foundry-ironsworn/pull/379))

## 1.15.11

- Fix starting track values for assets ([#375](https://github.com/ben/foundry-ironsworn/pull/375))

## 1.15.10

- Pre-load most game content on startup

## 1.15.9

- Reduce oracle-table re-loading from server

## 1.15.8

- Try a different method of ensuring compendium contents are loaded
- Hitting "enter" in oracle/move search no longer breaks Foundry

## 1.15.7

- Fix "reroll" button in Ironsworn oracle-roll chat cards

## 1.15.6

- Cap action scores at 10 ([#371](https://github.com/ben/foundry-ironsworn/pull/371))

## 1.15.5

- Re-enable rolling against health/spirit/supply

## 1.15.4

- Re-ordering for progresses and assets on IS sheet

## 1.15.3

- Re-ordering for assets ([#368](https://github.com/ben/foundry-ironsworn/pull/368))
- Re-ordering for progresses ([#369](https://github.com/ben/foundry-ironsworn/pull/369))
- Re-ordering for connections
- Re-ordering for the shared sheet

## 1.15.2

- Fix some placeholder text

## 1.15.1

- Fix a tooltip

## 1.15.0

- Update the location sheet layout to clarify order of decisions ([#365](https://github.com/ben/foundry-ironsworn/pull/365))

## 1.14.0

- Bump dataforged and fix the missing 50/50 oracle button in the chat card for "Ask the Oracle"
- Oracle search: also match against Dataforged aliases

## 1.13.0

## 1.12.0

- Render Markdown in oracle results on their way to chat
- Autofocus bonus input when SF roll-a-move dialog opens
- Make sure spinner buttons show up on numeric controls

## 1.11.7

- Avoid opening the roll dialog for some moves where the system can't find the stat to be rolled against (e.g. _Withstand Damage_)
- Add a d10 icon to asset-track headers, to better indicate that they're rollable
- Add d10 icons to the health/spirit/supply headers, to better indicate that they're rollable
- Bump to v1.0 of Dataforged ([#338](https://github.com/ben/foundry-ironsworn/pull/338))
- Visual update to edge/heart/etc boxes including a d10 icon

## 1.11.6

- Also replace lone-oracle links ([#356](https://github.com/ben/foundry-ironsworn/pull/356))

## 1.11.5

- Fixes a small visual glitch for content links in the chat bar

## 1.11.4

- Update the in-Foundry setup-screen name of the system
- Add a "completed items" area to the shared sheet ([#353](https://github.com/ben/foundry-ironsworn/pull/353))
- Better handling of links to oracle categories ([#354](https://github.com/ben/foundry-ironsworn/pull/354))

## 1.11.3

- Decorate rolltable compendia with category information ([#350](https://github.com/ben/foundry-ironsworn/pull/350))
- Remove the bond track from shared sheets (in most cases) ([#352](https://github.com/ben/foundry-ironsworn/pull/352))

## 1.11.2

- Fix bonds on the shared sheet

## 1.11.1

- Add a system-settings button to open the IS/SF configuration dialog
- Prevent minimizing output JS, which fixes default-character-sheet selection

## 1.11.0

- Fix the stellar-object-type oracle roll button
- Add a first-start dialog so the player can choose some options ([#346](https://github.com/ben/foundry-ironsworn/pull/346))
- Move starforged content out of beta ([#348](https://github.com/ben/foundry-ironsworn/pull/348))

## 1.10.64

- Fix the name of new stellar objects
- Prevent chat logging of bondsets when creating characters
- Fix location sheet oracle rolling

## 1.10.63

- Use the Starforged-style oracle tree for Ironsworn, with Dataforged-powered tables ([#337](https://github.com/ben/foundry-ironsworn/pull/337))
- Allow explicit setting of which toolbox to use ([#344](https://github.com/ben/foundry-ironsworn/pull/344))

## 1.10.62

- Fix the move editor ([#336](https://github.com/ben/foundry-ironsworn/pull/336))

## 1.10.61

- Custom moves from folder and hook ([#334](https://github.com/ben/foundry-ironsworn/pull/334))

## 1.10.60

- Oracle hooks can add tables to oracle nodes ([#333](https://github.com/ben/foundry-ironsworn/pull/333))

## 1.10.59

- Fix oracle search ([#331](https://github.com/ben/foundry-ironsworn/pull/331))
- Oracle chat-card output supports path to custom oracles ([#332](https://github.com/ben/foundry-ironsworn/pull/332))

## 1.10.58

- Add the "path" to the rolled oracle to the chat card output ([#329](https://github.com/ben/foundry-ironsworn/pull/329))
- Allow custom oracles ([#330](https://github.com/ben/foundry-ironsworn/pull/330))

## 1.10.57

- Fix oracle-result links to "action+theme" and strip undisplayable characters ([#328](https://github.com/ben/foundry-ironsworn/pull/328))
- Try to prevent broken reroll button
- Fix a table-layout problem

## 1.10.56

- "Collapse all" buttons on move and oracle sheets ([#322](https://github.com/ben/foundry-ironsworn/pull/322))
- Replace `▶ Descriptor + Focus` links in oracles with two links ([#323](https://github.com/ben/foundry-ironsworn/pull/323))
- Oracle chat cards: display "42" insteaed of "42-42" when high and low are equal
- A better "not-completed" icon for progress items
- Replace the cube icon with a custom d10 ([#327](https://github.com/ben/foundry-ironsworn/pull/327))

## 1.10.55

- Update the starship sheet to be more useful ([#318](https://github.com/ben/foundry-ironsworn/pull/318))
- Update the move sheet to better match the oracle sheet ([#320](https://github.com/ben/foundry-ironsworn/pull/320))

## 1.10.54

- [#317](https://github.com/ben/foundry-ironsworn/pull/317):
  - Expand the move sheet when navigating to a move
  - Strip tables from chat-log output for moves like _Pay the Price_ that don't roll any dice and have an oracle.

## 1.10.53

- One more instance of "Bonds"

## 1.10.52

- Catch bad regexes in search boxes
- "Bonds" -> "Connections" ([#315](https://github.com/ben/foundry-ironsworn/pull/315))

## 1.10.51

- Fix location-class and name rollers
- Add clocks to asset abilities ([#311](https://github.com/ben/foundry-ironsworn/pull/311))

## 1.10.50

- Some fixes to the Starforged theme ([#310](https://github.com/ben/foundry-ironsworn/pull/310))

## 1.10.49

- Include extra text in oracle results ([#307](https://github.com/ben/foundry-ironsworn/pull/307))

## 1.10.48

- Refactor some CSS ([#305](https://github.com/ben/foundry-ironsworn/pull/305))
- Add a "reroll" button to oracle-roll chat cards ([#306](https://github.com/ben/foundry-ironsworn/pull/306))

## 1.10.47

- Better oracles in the movesheet ([#303](https://github.com/ben/foundry-ironsworn/pull/303))

## 1.10.46

- Prune Starforged sectors to just one ([#301](https://github.com/ben/foundry-ironsworn/pull/301))
- Bump Dataforged for content fixes ([#302](https://github.com/ben/foundry-ironsworn/pull/302))

## 1.10.45

- Centralize Dataforged import and improve encounter display ([#297](https://github.com/ben/foundry-ironsworn/pull/297))
- Bump to latest Dataforged, which changes IDs and breaks links ([#299](https://github.com/ben/foundry-ironsworn/pull/299))
- Fix double-logging of item deletion ([#300](https://github.com/ben/foundry-ironsworn/pull/300))

## 1.10.44

- Implement momentum-burn button for Starforged moves ([#296](https://github.com/ben/foundry-ironsworn/pull/296))

## 1.10.43

- Replace crypto.subtle with sha.js for ID hashing ([#295](https://github.com/ben/foundry-ironsworn/pull/295))

## 1.10.42

- Reload the browser when SF beta flag is changed
- Don't send progress rolls to a useless dialog flow
- Fix some color issues in Starforged theme
- Bump dataforged to 0.4.x ([#290](https://github.com/ben/foundry-ironsworn/pull/290))

## 1.10.41

- Provide oracle-rolling buttons on move chat cards ([#287](https://github.com/ben/foundry-ironsworn/pull/287))
- Implement "best of" and "worst of" move rolling (also [#287](https://github.com/ben/foundry-ironsworn/pull/287))
- Display neighboring results when rolling oracles ([#288](https://github.com/ben/foundry-ironsworn/pull/288))

## 1.10.40

- Fix location token and oracle bugs ([#284](https://github.com/ben/foundry-ironsworn/pull/284))
- Hide asset descriptions from inline view ([#285](https://github.com/ben/foundry-ironsworn/pull/285))
- Battered and cursed are global conditions ([#286](https://github.com/ben/foundry-ironsworn/pull/286))

## 1.10.39

- Fix SF move rolling ([#280](https://github.com/ben/foundry-ironsworn/pull/280))

## 1.10.38

- Fix the SF asset import ([#279](https://github.com/ben/foundry-ironsworn/pull/279))

## 1.10.37

- Oracle tree search and i18n ([#277](https://github.com/ben/foundry-ironsworn/pull/277))

## 1.10.36

- Chat log when the "completed" flag changes ([#270](https://github.com/ben/foundry-ironsworn/pull/270))
- Fix a typo in an Ironsworn oracle (Thanks @Porges! [#271](https://github.com/ben/foundry-ironsworn/pull/271))
- Update the Spanish translation files (Thanks @WallaceMcGregor! [#268](https://github.com/ben/foundry-ironsworn/pull/268))
- Updated a few functions to adhere to reactive data functionality (Thanks @DasGinger! [#273](https://github.com/ben/foundry-ironsworn/pull/273))
- Introduce a new kind of move for Starforged, and build it on top of Dataforged moves ([#272](https://github.com/ben/foundry-ironsworn/pull/272))

## 1.10.35

- Use the Quill editor in the location sheet ([#267](https://github.com/ben/foundry-ironsworn/pull/267))
- Clicking on moves in chat cards does a move-sheet navigation ([#269](https://github.com/ben/foundry-ironsworn/pull/269))

## 1.10.34

- The "Foes" button in the SF progresses tab was opening the wrong compendium ([#260](https://github.com/ben/foundry-ironsworn/pull/260))
- Update dataforged data ([#261](https://github.com/ben/foundry-ironsworn/pull/261))
- Store moves' full descriptive text, and use it in the move sheet ([#263](https://github.com/ben/foundry-ironsworn/pull/263))

## 1.10.33

- A widget for "completed" progress items in the SF sheet ([#257](https://github.com/ben/foundry-ironsworn/pull/257))

## 1.10.32

- HTML editor can now handle Foundry item drops ([#256](https://github.com/ben/foundry-ironsworn/pull/256))

## 1.10.31

- HTML editor has configurable theme and can do image uploads ([#254](https://github.com/ben/foundry-ironsworn/pull/254))

## 1.10.30

- A new HTML editor for the SF character notes tab ([#250](https://github.com/ben/foundry-ironsworn/pull/250))
- A "foe" actor type so that a progress item can have a token ([#252](https://github.com/ben/foundry-ironsworn/pull/252))
- Use the HTML editor for the IS notes box ([#253](https://github.com/ben/foundry-ironsworn/pull/253))

## 1.10.29

- Derelict/vault/settlement token images ([#244](https://github.com/ben/foundry-ironsworn/pull/244))
- Ensure planets are drawn behind their neighbors ([#246](https://github.com/ben/foundry-ironsworn/pull/246))
- Better updating of token images when editing a locaiton ([#247](https://github.com/ben/foundry-ironsworn/pull/247))
- Token HUD buttons for 60° rotation ([#248](https://github.com/ben/foundry-ironsworn/pull/248))

## 1.10.28

- "Derelict" as a type of location ([#242](https://github.com/ben/foundry-ironsworn/pull/242))
- "Precursor Vault" as a type of location ([#243](https://github.com/ben/foundry-ironsworn/pull/243))

## 1.10.27

- Fix a wrong-oracle bug with random-type rolling in the location sheet

## 1.10.26

- Scene buttons generate actors in folders ([#237](https://github.com/ben/foundry-ironsworn/pull/237))
- …and also drop a token in the center of the viewport ([#239](https://github.com/ben/foundry-ironsworn/pull/239))
- Wire up settlement/star oracles in location sheet ([#240](https://github.com/ben/foundry-ironsworn/pull/240))

## 1.10.25

- Fix a bug where creating progress/vow items would output to chat multiple times ([#235](https://github.com/ben/foundry-ironsworn/pull/235))
- Add a notes area to the delve sheet ([#236](https://github.com/ben/foundry-ironsworn/pull/236))

## 1.10.24

- Random planet names ([#231](https://github.com/ben/foundry-ironsworn/pull/231))
- Fix the Vue Ironsworn sheet's 0-xp button ([#232](https://github.com/ben/foundry-ironsworn/pull/232))

## 1.10.23

- Add a sector-edit dialog ([#224](https://github.com/ben/foundry-ironsworn/pull/225))
- Add a location sheet with planet-gen tools ([#226](https://github.com/ben/foundry-ironsworn/pull/226))
- Add some starship token images (thanks, @TW-wilsonam! [#228](https://github.com/ben/foundry-ironsworn/pull/228))
- Add "locations" to the create-actor dialog ([#229](https://github.com/ben/foundry-ironsworn/pull/229))

## 1.10.22

- Update and fix some issues with Dataforged data ([#224](https://github.com/ben/foundry-ironsworn/pull/224))

## 1.10.21

- Rough in a starship sheet ([#223](https://github.com/ben/foundry-ironsworn/pull/223))

## 1.10.20

- Add planet tokens from official sources ([#221](https://github.com/ben/foundry-ironsworn/pull/221))
- Add a ship actor type ([#220](https://github.com/ben/foundry-ironsworn/pull/220))

## 1.10.19

- Also turn these on inside the movesheet ([#219](https://github.com/ben/foundry-ironsworn/pull/219))

## 1.10.18

- Inline move links highlight moves in movesheet ([#218](https://github.com/ben/foundry-ironsworn/pull/218))

## 1.10.17

- Fix a bug with the Delve move roller (thanks, @UmbralAlderman! [#216](https://github.com/ben/foundry-ironsworn/pull/216))
- SF: add conditions to sheet ([#217](https://github.com/ben/foundry-ironsworn/pull/217))

## 1.10.16

- Rough in an Assets tab for the Starforged sheet ([#215](https://github.com/ben/foundry-ironsworn/pull/215))

## 1.10.15

- Tweak some Dataforged import and fix some assets ([#211](https://github.com/ben/foundry-ironsworn/pull/211))
- Expandable moves in the movesheet ([#213](https://github.com/ben/foundry-ironsworn/pull/213))

## 1.10.14

- Use dataforged `$id` properties to find moves in the compendium ([#208](https://github.com/ben/foundry-ironsworn/pull/208))
- i18n fallback for chat cards when rolling moves ([#209](https://github.com/ben/foundry-ironsworn/pull/209))
- Search box for SF moves and oracles ([#210](https://github.com/ben/foundry-ironsworn/pull/210))

## 1.10.13

- Implement the "moves" tab of the SF movesheet ([#207](https://github.com/ben/foundry-ironsworn/pull/207))

## 1.10.12

- Implement the "oracles" tab of the SF movesheet ([#206](https://github.com/ben/foundry-ironsworn/pull/206))

## 1.10.11

- Import data from Dataforged, and generate compendia ([#205](https://github.com/ben/foundry-ironsworn/pull/205))

## 1.10.10

- Add scene buttons for generating things for sectors ([#201](https://github.com/ben/foundry-ironsworn/pull/201))
- …that tell you to hold your horses ([#202](https://github.com/ben/foundry-ironsworn/pull/202))
- Starforged XP tracks: better usability ([#203](https://github.com/ben/foundry-ironsworn/pull/203))

## 1.10.9

- Progress items have clocks ([#200](https://github.com/ben/foundry-ironsworn/pull/200))

## 1.10.8

- Starforged moves/oracles sheet ([#197](https://github.com/ben/foundry-ironsworn/pull/197))
- Compendium of Starforged scenes ([#199](https://github.com/ben/foundry-ironsworn/pull/199))

## 1.10.7

- "Retreat" button for IS progress boxes ([#191](https://github.com/ben/foundry-ironsworn/pull/191))
- Implement the "Bonds" tab ([#195](https://github.com/ben/foundry-ironsworn/pull/195))

## 1.10.6

- Fix some Vue warnings ([#189](https://github.com/ben/foundry-ironsworn/pull/189))
- Add notes areas to the Ironsworn Vue sheets ([#190](https://github.com/ben/foundry-ironsworn/pull/190))

## 1.10.5

- Fix truths dialog and a Vue warning ([#188](https://github.com/ben/foundry-ironsworn/pull/188))

## 1.10.4

- Replace "Clocks" and "Scenes" with "Notes" ([#187](https://github.com/ben/foundry-ironsworn/pull/187))

## 1.10.3

- Implement the progresses tab ([#182](https://github.com/ben/foundry-ironsworn/pull/182))
- Convert "vow" objects to "progress" objects ([#183](https://github.com/ben/foundry-ironsworn/pull/183))
- Starrable progress items show on the legacies tab ([#184](https://github.com/ben/foundry-ironsworn/pull/184))

## 1.10.2

- Fix change logging and tweak a style ([#181](https://github.com/ben/foundry-ironsworn/pull/181))

## 1.10.1

- Starforged: legacy tracks ([#180](https://github.com/ben/foundry-ironsworn/pull/180))

## 1.10.0

- Add Starforged setting-truths dialog ([#178](https://github.com/ben/foundry-ironsworn/pull/178))
- Add Starforged character sheet ([#179](https://github.com/ben/foundry-ironsworn/pull/179))

## 1.9.0

- Add french localization ([#175](https://github.com/ben/foundry-ironsworn/pull/175))

## 1.8.7

- Swap in a higher-quality file for McSekcer's map ([#169](https://github.com/ben/foundry-ironsworn/pull/169))

## 1.8.6

- Add a hand-drawn map from Reddit to the scene compendium ([#168](https://github.com/ben/foundry-ironsworn/pull/168))

## 1.8.5

- Fix a move sheet layout issue ([#166](https://github.com/ben/foundry-ironsworn/pull/166))
- Upgrade support for "Pay the Price" ([#167](https://github.com/ben/foundry-ironsworn/pull/167))

## 1.8.4

- Fix world-truths dialog when `routePrefix` is configured ([#164](https://github.com/ben/foundry-ironsworn/pull/164))

## 1.8.3

- Fix 404 errors when `routePrefix` is configured ([#163](https://github.com/ben/foundry-ironsworn/pull/163))

## 1.8.2

- Update NPM dependencies ([#160](https://github.com/ben/foundry-ironsworn/pull/160))
- Fix an actor-creation bug ([#161](https://github.com/ben/foundry-ironsworn/pull/161))

## 1.8.1

- Fix oracle weights for the Challenge Rank table ([#159](https://github.com/ben/foundry-ironsworn/pull/159))

## 1.8.0

- Remove Chinese-language files ([#157](https://github.com/ben/foundry-ironsworn/pull/157))

## 1.7.4

- Mark the system as commpatible with Foundry v9 ([#156](https://github.com/ben/foundry-ironsworn/pull/156))

## 1.7.3

- Fix [#111](https://github.com/ben/foundry-ironsworn/pull/111), which is an i18n bug ([#154](https://github.com/ben/foundry-ironsworn/pull/154))

## 1.7.2

- Vue asset sheet ([#150](https://github.com/ben/foundry-ironsworn/pull/150))
- Make the Vue sheets default for all types ([#152](https://github.com/ben/foundry-ironsworn/pull/152))
- Vue cleanup ([#153](https://github.com/ben/foundry-ironsworn/pull/153))

## 1.7.1

- Vue progress/vow sheet ([#147](https://github.com/ben/foundry-ironsworn/pull/147))
- Vue bondset sheet ([#148](https://github.com/ben/foundry-ironsworn/pull/148))
- Vue helper for finding a sheet's actor ([#149](https://github.com/ben/foundry-ironsworn/pull/149))
- Fix scrollbars in all browsers ([#151](https://github.com/ben/foundry-ironsworn/pull/151))

## 1.7.0

- Log character changes to chat ([#143](https://github.com/ben/foundry-ironsworn/pull/143))

## 1.6.6

- Update visual style for "best" and "worst" die rolls ([#145](https://github.com/ben/foundry-ironsworn/pull/145))
- Add Russian-language translation (thanks, @HesperidesGardden!) ([#130](https://github.com/ben/foundry-ironsworn/pull/130) and [#146](https://github.com/ben/foundry-ironsworn/pull/146))

## 1.6.5

- Actor select in move dialog if needed ([#142](https://github.com/ben/foundry-ironsworn/pull/142))

## 1.6.4

- Make the Vue site sheet the default ([#141](https://github.com/ben/foundry-ironsworn/pull/141))

## 1.6.3

- Make tick marks a bit less square ([#138](https://github.com/ben/foundry-ironsworn/pull/138))
- Add a v2 site sheet based on vue ([#133](https://github.com/ben/foundry-ironsworn/pull/133))
- Fix a bug in the v2 character sheet ([#139](https://github.com/ben/foundry-ironsworn/pull/139))
- Make canceled action dice more visible ([#140](https://github.com/ben/foundry-ironsworn/pull/140))

## 1.6.2

- Add a v2 shared sheet based on Vue ([#131](https://github.com/ben/foundry-ironsworn/pull/131))
- Rearrange sheets in dropdown, make v2 shared sheet the default ([#132](https://github.com/ben/foundry-ironsworn/pull/132))

## 1.6.1

- Add Vue animations to character sheet ([#127](https://github.com/ben/foundry-ironsworn/pull/127))
- Make v2 character sheet the default ([#128](https://github.com/ben/foundry-ironsworn/pull/128))

## 1.6.0

- Add a "v2" character sheet that uses Vue ([#126](https://github.com/ben/foundry-ironsworn/pull/126))

## 1.5.3

- Stop warning on Foundry 0.8.9

## 1.5.2

- Add the missing "Settlement Name (Old Language) oracle ([#125](https://github.com/ben/foundry-ironsworn/pull/125))
- Extend the Spanish-language translations ([#122](https://github.com/ben/foundry-ironsworn/pull/122))

## 1.5.1

- Make the oracles and moves tabs of the move sheet behave more alike ([#120](https://github.com/ben/foundry-ironsworn/pull/120))

## 1.5.0

- Streamline and downsize some text in the character sheet ([#109](https://github.com/ben/foundry-ironsworn/pull/109))
- Fix a few bugs ([#116](https://github.com/ben/foundry-ironsworn/pull/116))

## 1.4.4

- Highlight drag targets on site sheet ([#108](https://github.com/ben/foundry-ironsworn/pull/108))

## 1.4.3

- Add drag/drop support for foes into site sheet ([#107](https://github.com/ben/foundry-ironsworn/pull/107))

## 1.4.2

- Fix the spelling of "formidable" ([#105](https://github.com/ben/foundry-ironsworn/pull/105))
- Include a "foes" compendium ([#106](https://github.com/ben/foundry-ironsworn/pull/106))

## 1.4.1

- I18n fixes ([#99](https://github.com/ben/foundry-ironsworn/pull/99))

## 1.4.0

- Add a "Your Truths" worksheet ([#97](https://github.com/ben/foundry-ironsworn/pull/97))

## 1.3.7

- Fix the parsing and logic for the Sojourn move ([#96](https://github.com/ben/foundry-ironsworn/pull/96))

## 1.3.6

- Fixed input set to type=textarea:
  This one broke cursor interaction in Firefox.

- Fixed sheet not scaling correctly in Firefox

## 1.3.5

- Add a search box to the character move sheet ([#92](https://github.com/ben/foundry-ironsworn/pull/92))

## 1.3.4

## 1.3.3

- Adding [manifest+](https://foundryvtt.wiki/en/development/manifest-plus) fields to `system.json`

## 1.3.2

- Improve the "Locate Your Objective" experience ([#90](https://github.com/ben/foundry-ironsworn/pull/90))
- Show dice-so-nice rolls when clicking in-chat-message table-roll buttons
- Add a random-denizen button ([#91](https://github.com/ben/foundry-ironsworn/pull/91))

## 1.3.1

- Fixed some layout issues
- Updated readme
- Sheets now use human-readable labels instead of minified Javascript garbage

## 1.3.0

- Change compendium scene scale to 50
- Delve sites ([#88](https://github.com/ben/foundry-ironsworn/pull/88))
- Site denizens ([#89](https://github.com/ben/foundry-ironsworn/pull/89))

## 1.2.0

- Momentum does not apply to progress rolls ([#86](https://github.com/ben/foundry-ironsworn/pull/86))
- New-actor dialog ([#87](https://github.com/ben/foundry-ironsworn/pull/87))

## 1.1.2

- Remove "site" from the list of items a player can create ([#85](https://github.com/ben/foundry-ironsworn/pull/85))

## 1.1.1

- Negative momentum cancels action die ([#81](https://github.com/ben/foundry-ironsworn/pull/81))
- Better display for tick marks ([#82](https://github.com/ben/foundry-ironsworn/pull/82))

## 1.1.0

- "Burn momentum" button in chat cards ([#78](https://github.com/ben/foundry-ironsworn/pull/78))
- Images for vows and progress items ([#80](https://github.com/ben/foundry-ironsworn/pull/80))

## 1.0.1

- Update to newest Foundry types ([#76](https://github.com/ben/foundry-ironsworn/pull/76))
- Add edit/delete buttons to move sheet ([#77](https://github.com/ben/foundry-ironsworn/pull/77))

## 1.0.0

- Implement radio-select options for assets ([#75](https://github.com/ben/foundry-ironsworn/pull/75))
- Implement 6-health option for Awaken ritual ([#74](https://github.com/ben/foundry-ironsworn/pull/74))
- Update move item structure and allow custom moves in move sheet ([#72](https://github.com/ben/foundry-ironsworn/pull/72))

## 0.5.4

- Include move text in stat-choice dialog ([#68](https://github.com/ben/foundry-ironsworn/pull/68))
- Use the "Fulfill Your Vow" move when trying to complete a vow ([#70](https://github.com/ben/foundry-ironsworn/pull/70))

## 0.5.3

## 0.5.2

## 0.5.1

- Fixing auto-update logic

## 0.5.0

- Rework move structure and enhance move sheet ([#62](https://github.com/ben/foundry-ironsworn/pull/62))
- Update roll-bonus dialog to allow selecting stat for moves ([#63](https://github.com/ben/foundry-ironsworn/pull/63))
- _Much_ nicer chat cards for structured rolls ([#64](https://github.com/ben/foundry-ironsworn/pull/64))

## 0.4.9

- Add portrait and name fields to shared sheet ([#59](https://github.com/ben/foundry-ironsworn/pull/59))

## 0.4.8

- Add a shared sheet ([#55](https://github.com/ben/foundry-ironsworn/pull/55))

## 0.4.7

- Fix the move sheet's description ([#54](https://github.com/ben/foundry-ironsworn/pull/54))

## 0.4.6

- Fix the asset-sheet delete button ([#51](https://github.com/ben/foundry-ironsworn/pull/51))
- Add a compact character sheet ([#50](https://github.com/ben/foundry-ironsworn/pull/50))

## 0.4.5

- Increase the contrast of the Starforged theme ([#49](https://github.com/ben/foundry-ironsworn/pull/49))

## 0.4.4

- Fix the asset sheet ([#45](https://github.com/ben/foundry-ironsworn/pull/45))
- Unify and update the progress/vow sheets ([#46](https://github.com/ben/foundry-ironsworn/pull/46))
- Restructure the use of headers ([#47](https://github.com/ben/foundry-ironsworn/pull/47))

## 0.4.3

- Restructure i18n files ([#37](https://github.com/ben/foundry-ironsworn/pull/37))
- Edit mode for assets ([#38](https://github.com/ben/foundry-ironsworn/pull/38))
- Visual tweaks ([#39](https://github.com/ben/foundry-ironsworn/pull/39))
- More visual tweaks ([#40](https://github.com/ben/foundry-ironsworn/pull/40))
- Convert rank selection to a hex widget ([#41](https://github.com/ben/foundry-ironsworn/pull/41))
- A better Starforged theme ([42](https://github.com/ben/foundry-ironsworn/pull/42))

## 0.4.2

- Momentum boxes above max are disabled ([#32](https://github.com/ben/foundry-ironsworn/pull/32))
- Separate sheet for moves ([#33](https://github.com/ben/foundry-ironsworn/pull/33))
- Framework for multiple themes ([#35](https://github.com/ben/foundry-ironsworn/pull/35))
- Move health/spirit/supply tracks to right side of sheet ([#36](https://github.com/ben/foundry-ironsworn/pull/36))

## 0.4.1

- More code reorganization, and a couple of aesthetic changes ([#31](https://github.com/ben/foundry-ironsworn/pull/31))

## 0.4.0

- Convert project to Typescript and Webpack ([#28](https://github.com/ben/foundry-ironsworn/pull/28))

## 0.3.4

- Actually include Español in system languages ([#28](https://github.com/ben/foundry-ironsworn/issues/28))

## 0.3.3

- Translations update from Weblate ([#24](https://github.com/ben/foundry-ironsworn/pull/24))

## 0.3.2

- Fix some i18n issues ([#26](https://github.com/ben/foundry-ironsworn/issues/26))

## 0.3.1

- Fix choice oracles ([#21](https://github.com/ben/foundry-ironsworn/issues/21))

## 0.3.0

- Foundry 0.8.x compatibility ([#20](https://github.com/ben/foundry-ironsworn/issues/20))

## 0.2.5

- Added roll tables from the 'Ask the Oracle' move ([#19](https://github.com/ben/foundry-ironsworn/issues/19))

## 0.2.4

- Convert moves from owned items to a static list ([#18](https://github.com/ben/foundry-ironsworn/issues/18)). You'll want to remove all `move` items from your existing characters if you're upgrading to this version.

## 0.2.3

- Added Simplified Chinese language support ([#17](https://github.com/ben/foundry-ironsworn/issues/17))
