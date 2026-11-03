// Lists Datasworn move outcomes that give a resource or a next-move bonus but
// aren't in src/module/rolls/move-outcome-effects.ts, so the roll-card table
// can be reviewed after a Datasworn update. Moves left out on purpose are
// listed in REVIEWED below.
//
// USAGE: node script/check-outcome-effects.js

import { readFileSync } from 'fs'

const PACKAGES = [
	'ironsworn-classic/json/classic.json',
	'ironsworn-classic-delve/json/delve.json',
	'ironsworn-classic-lodestar/json/lodestar.json',
	'starforged/json/starforged.json',
	'sundered-isles/json/sundered_isles.json'
]

/** Outcomes with gains that can't be applied as stated, so they're left out. */
const REVIEWED = {
	// Depend on the character's impacts ("If you are shaken… otherwise…")
	'move:starforged/recover/heal': 'depends on impacts',
	'move:starforged/recover/hearten': 'depends on impacts',
	// Future gains or rewards, not gains now
	'move:starforged/connection/make_a_connection': 'future gain',
	'move:starforged/connection/forge_a_bond': 'future gain',
	// Gains for companions, or "up to" / "for each" amounts
	'move:starforged/suffer/companion_takes_a_hit': 'companion',
	'move:classic/suffer/companion_endure_harm': 'companion',
	'move:classic/adventure/heal': '"up to" amount',
	'move:classic/relationship/sojourn': 'choices per category and ally',
	'move:classic/adventure/undertake_a_journey': 'gain bundled with a cost',
	// Repair points, not meters
	'move:starforged/recover/repair': 'repair points',
	'move:sundered_isles/recover/repair': 'repair points',
	// Experience, not meters
	'move:delve/failure/learn_from_your_failures': 'experience'
}

/** A gain the roll card could apply: "+2 momentum", "add +1 on your next move". */
const GAIN =
	/(?:take|give|gain|in exchange for)[^.*]*?\+\d+ (?:momentum|health|spirit|supply|integrity)|\+\d+ on your next move/i

const tableSource = readFileSync(
	'src/module/rolls/move-outcome-effects.ts',
	'utf8'
)
const inTable = new Set(
	(tableSource.match(/'move:[^']+'/g) ?? []).map((x) => x.slice(1, -1))
)

let missing = 0
for (const file of PACKAGES) {
	const data = JSON.parse(
		readFileSync(`node_modules/@datasworn-community/${file}`, 'utf8')
	)
	for (const category of Object.values(data.moves ?? {})) {
		for (const move of Object.values(category.contents ?? {})) {
			if (inTable.has(move._id) || move._id in REVIEWED) continue
			for (const [outcome, { text }] of Object.entries(move.outcomes ?? {})) {
				if (!GAIN.test(text ?? '')) continue
				missing++
				console.log(`${move._id} (${outcome}): ${text.replace(/\s+/g, ' ')}`)
			}
		}
	}
}

if (missing > 0) {
	console.log(
		`\n${missing} outcome(s) to review: add them to move-outcome-effects.ts, or to REVIEWED in this script.`
	)
	process.exit(1)
}
console.log('Every outcome with a gain is in the table or reviewed.')
