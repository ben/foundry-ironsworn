import { index, tree } from '../tests/loadJson.js'

const glob = new Bun.Glob('**/*.json')

const readOps: Promise<unknown>[] = []

for await (const filePath of glob.scan({
	cwd: './src/legacy_ids',
	absolute: true
})) {
	readOps.push(
		Bun.file(filePath)
			.json()
			.then((data: Record<string, string | null>) => {
				for (const k in data) {
					const v = data[k]
					if (v == null) continue
					if (!index.has(v)) console.log(v)
				}
			})
	)
}

await Promise.all(readOps)
