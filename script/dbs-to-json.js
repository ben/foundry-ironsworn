// extracts pack DB to JSON in the src directory
// run it after editing via FVTT to update the source JSON

import { extractPack } from '@foundryvtt/foundryvtt-cli'
import fs from 'fs-extra'
import path from 'path'
import { packJsonPath, packDbPath } from './packs-const.js'

const packs = await fs.readdir(packDbPath)

await fs.emptyDir(packJsonPath)

for await (const pack of packs) {
	await extractPack(
		path.join(packDbPath, pack),
		path.join(packJsonPath, pack),
		{ nedb: pack.endsWith('.db') }
	)
}
