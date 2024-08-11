import classic from '@datasworn/ironsworn-classic/json/classic.json' assert { type: 'json' }
import delve from '@datasworn/ironsworn-classic-delve/json/delve.json' assert { type: 'json' }
import starforged from '@datasworn/starforged/json/starforged.json' assert { type: 'json' }
import sunderedIsles from '@datasworn/sundered-isles/json/sundered_isles.json' assert { type: 'json' }

import { Datasworn, DataswornTree, IdParser } from '@datasworn/core'

const rulesPackages = [
	classic,
	delve,
	starforged,
	sunderedIsles
] as Datasworn.RulesPackage[]

const tree = new DataswornTree(...rulesPackages)
export { tree as DataswornTree }

// Configure the ID parser to use the new tree by default. This is optional, but without it you'll have to specify the tree object every time
IdParser.datasworn = tree
export { IdParser }
