import classic from '@datasworn/ironsworn-classic/json/classic.json'
import delve from '@datasworn/ironsworn-classic-delve/json/delve.json'
import starforged from '@datasworn/starforged/json/starforged.json'
import sunderedIsles from '@datasworn/sundered-isles/json/sundered_isles.json'

import * as DSCore from '@datasworn/core'
import type { Datasworn } from '@datasworn/core'

const rulesPackages = [
	classic,
	delve,
	starforged,
	sunderedIsles
] as Datasworn.RulesPackage[]

export const DataswornTree = new DSCore.DataswornTree(...rulesPackages)

// Configure the ID parser to use the new tree by default. This is optional, but without it you'll have to specify the tree object every time
const IdParser = DSCore.IdParser
IdParser.datasworn = DataswornTree
export { IdParser }

export * from './finding'
