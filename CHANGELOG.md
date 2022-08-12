# Changelog

## In progress

- Fix the values for momentum max/reset for new characters

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
