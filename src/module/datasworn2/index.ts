import classic from '@datasworn-community/ironsworn-classic/json/classic.json'
import delve from '@datasworn-community/ironsworn-classic-delve/json/delve.json'
import lodestar from '@datasworn-community/ironsworn-classic-lodestar/json/lodestar.json'
import starforged from '@datasworn-community/starforged/json/starforged.json'
import sunderedIsles from '@datasworn-community/sundered-isles/json/sundered_isles.json'

import * as DSCore from '@datasworn-community/core'
import type { Datasworn } from '@datasworn-community/core'

const rulesPackages = [
	classic,
	delve,
	lodestar,
	starforged,
	sunderedIsles
] as Datasworn.RulesPackage[]

export const DataswornTree = new DSCore.DataswornTree(...rulesPackages)

// Configure the ID parser to use the new tree by default. This is optional, but without it you'll have to specify the tree object every time
const IdParser = DSCore.IdParser
IdParser.datasworn = DataswornTree
export { IdParser }

export * from './finding'
