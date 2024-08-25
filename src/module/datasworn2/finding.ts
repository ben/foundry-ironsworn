import { IdParser } from '.'
import { IronswornItem } from '../item/item'

// The first keys are the primary type ids, the second keys are the rules package ids
export const COMPENDIUM_KEY_MAP: Record<string, Record<string, string>> = {
	asset: {
		classic: 'foundry-ironsworn.ironswornassets',
		starforged: 'foundry-ironsworn.starforgedassets',
		sundered_isles: 'foundry-ironsworn.sunderedislesassets'
	},
	move_category: {
		classic: 'foundry-ironsworn.ironswornmoves',
		starforged: 'foundry-ironsworn.starforgedmoves',
		sundered_isles: 'foundry-ironsworn.sunderedislesmoves'
	},
	move: {
		classic: 'foundry-ironsworn.ironswornmoves',
		delve: 'foundry-ironsworn.ironsworndelvemoves',
		starforged: 'foundry-ironsworn.starforgedmoves',
		sundered_isles: 'foundry-ironsworn.sunderedislesmoves'
	},
	oracle_collection: {
		classic: 'foundry-ironsworn.ironswornoracles',
		delve: 'foundry-ironsworn.delveoracles',
		starforged: 'foundry-ironsworn.starforgedoracles',
		sundered_isles: 'foundry-ironsworn.sunderedislesmoves'
	},
	oracle_rollable: {
		classic: 'foundry-ironsworn.ironswornoracles',
		delve: 'foundry-ironsworn.delveoracles',
		starforged: 'foundry-ironsworn.starforgedoracles',
		sundered_isles: 'foundry-ironsworn.sunderedislesoracles'
	},
	npc: {
		classic: 'foundry-ironsworn.ironswornfoes',
		delve: 'foundry-ironsworn.delvefoes',
		starforged: 'foundry-ironsworn.starforgedencounters',
		sundered_isles: 'foundry-ironsworn.sunderedislesnpcs'
	},
	delve_site_theme: {
		delve: 'foundry-ironsworn.ironsworndelvethemes'
	},
	delve_site_domain: {
		delve: 'foundry-ironsworn.ironsworndelvedomains'
	},
	truth: {
		classic: 'foundry-ironsworn.ironsworntruths',
		starforged: 'foundry-ironsworn.starforgedtruths',
		sundered_isles: 'foundry-ironsworn.sunderedislestruths'
	}
}
