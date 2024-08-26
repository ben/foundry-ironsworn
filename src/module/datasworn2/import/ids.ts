import shajs from 'sha.js'

// Import a local copy of the legacy ID maps
export const LegacyToDataswornIds: Record<string, string> = {
	...require('../../../../../datasworn/src/legacy_ids/dataforged/classic/assets.json'),
	...require('../../../../../datasworn/src/legacy_ids/dataforged/classic/moves.json'),
	...require('../../../../../datasworn/src/legacy_ids/dataforged/classic/npcs.json'),
	...require('../../../../../datasworn/src/legacy_ids/dataforged/classic/oracles.json'),
	...require('../../../../../datasworn/src/legacy_ids/dataforged/starforged/assets.json'),
	...require('../../../../../datasworn/src/legacy_ids/dataforged/starforged/moves.json'),
	...require('../../../../../datasworn/src/legacy_ids/dataforged/starforged/oracles.json'),
	...require('../../../../../datasworn/src/legacy_ids/dataforged/starforged/npcs.json'),
	...require('../../../../../datasworn/src/legacy_ids/dataforged/starforged/truths.json')
}
export const DataswornToLegacyIds: Record<string, string> = Object.fromEntries(
	Object.entries(LegacyToDataswornIds).map(([k, v]) => [v, k])
)
export const lookupLegacyId = (dsid: string): string => {
	const legacyId = DataswornToLegacyIds[dsid]
	if (
		!legacyId &&
		!dsid.includes('sundered_isles') &&
		!dsid.includes('oracle_rollable.row:') &&
		!dsid.includes('truth:classic') &&
		!dsid.startsWith('delve_site')
	) {
		console.log('!!! No legacy ID for', dsid)
	}
	return legacyId ?? dsid
}

export function hash(str: string): string {
	return shajs('sha256').update(str).digest('hex').substring(48)
}
