// compile source json into db files
// use it after updating the loose json files

import { compilePack } from '@foundryvtt/foundryvtt-cli'
import fs from 'fs-extra'
import path from 'path'
import { packJsonPath, packDbPath } from './packs-const.js'

const packs = await fs.readdir(packJsonPath)

await fs.emptyDir(packDbPath)

for await (const pack of packs) {
	await compilePack(path.join(packJsonPath, pack), path.join(packDbPath, pack))
}
