/*

{
  "_id": "npc:starforged/sample_npcs/chiton",
  "type": "npc",
  "name": "Chiton",
  "rank": 2,
  "nature": "Monster",
  "summary": "Insectoid horde",
  "features": [
    "Arachnid monsters with blade-like limbs",
    "Plated exoskeleton",
    "Dripping mucus",
    "Ripping, tearing maw"
  ],
  "drives": [
    "Build and expand the nest",
    "Feed and protect the queen",
    "Snuff out intelligent life"
  ],
  "tactics": [
    "Attack with lightning reflexes",
    "Impale with bladed limbs",
    "Drag victims back to the nest"
  ],
  "variants": {
    "chiton_drone_pack": {
      "_id": "npc.variant:starforged/sample_npcs/chiton.chiton_drone_pack",
      "name": "Chiton drone pack",
      "rank": 3,
      "nature": "Monster",
      "description": "Chiton drones rarely operate independently..."
    },
    "chiton_queen": {
      "_id": "npc.variant:starforged/sample_npcs/chiton.chiton_queen",
      "name": "Chiton queen",
      "rank": 4,
      "nature": "Monster",
      "description": "The chiton queen is a massive creature with ..."
    }
  },
  "description": "The chiton are not native to any single planet...",
  "quest_starter": "At a remote facility, researchers are studying ...",
  "_source": {
    "title": "Ironsworn: Starforged Rulebook",
    "authors": [
      {
        "name": "Shawn Tomkin"
      }
    ],
    "date": "2022-05-06",
    "license": "https://creativecommons.org/licenses/by/4.0",
    "page": 259,
    "url": "https://ironswornrpg.com"
  }
}
*/

import type { Npc } from '@datasworn/core/dist/Datasworn'
import { lookupLegacyId } from './ids'
import { renderLinksInStr, renderText } from './rendering'

export function renderNpcDescription(npc: Npc): string {
	const tickList = (name: string, list: string[]) =>
		`
<div class="flexcol box" style="justify-content: flex-start;">
  <h4 class="nogrow" style="margin: 0.5em;">${name}</h4>
  ${list.map((item) => `<p class="nogrow">${item}</p>`).join('\n')}
</div>
  `.trim()

	const questStarter = renderText(npc.quest_starter ?? '')

	const variants = Object.values(npc.variants)
	const variantLinks = variants.map((variant) =>
		renderLinksInStr(`[${variant.name}](datasworn:${variant._id})`)
	)

	const variantList =
		variants.length > 0
			? `
<h2>Variants</h2>
<ul>
  ${variantLinks.map((link) => `<li>${link}</li>`).join('\n')}
</ul>
  `.trim()
			: ''

	return `
<div class="boxgroup flexrow boxrow" style="margin-bottom: 0.5rem;">
  ${tickList('Features', npc.features)}
  ${tickList('Drives', npc.drives)}
  ${tickList('Tactics', npc.tactics)}
</div>

${renderText(npc.description)}

<blockquote>Quest Starter: ${questStarter}</blockquote>

${variantList}
  `.trim()
}
