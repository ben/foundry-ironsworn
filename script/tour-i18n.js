import fs from 'fs/promises'
import yaml from 'yaml'
import { set } from 'lodash-es'
import { marked } from 'marked'

async function doit() {
	// List the yaml files in the tours directory
	const files = await fs.readdir('./src/module/features/tours')
	const yamls = files.filter(
		(x) => x.toLowerCase().endsWith('.yml') || x.toLowerCase().endsWith('.yaml')
	)

	for (const yamlFilename of yamls) {
		console.log(yamlFilename)
		// Parse the yaml
		const contents = await (
			await fs.readFile(`./src/module/features/tours/${yamlFilename}`)
		).toString()
		const { rootKey, languages } = yaml.parse(contents)

		for (const { lang, entries } of languages ?? []) {
			console.log(`  - ${lang}`)

			// Load the i18n json file
			const i18njson = JSON.parse(
				(await fs.readFile(`./system/lang/${lang}.json`)).toString()
			)

			// Update the entries
			for (const entry of entries) {
				const description = marked
					.parse(entry.content, { gfm: true, headerIds: false, mangle: false })
					.replace(/<\/p>\n<p>/g, '</p><p>') // remove extra newlines
					.trim()
				set(i18njson, `${rootKey}.${entry.key}Title`, entry.title)
				set(i18njson, `${rootKey}.${entry.key}Content`, description)
			}

			// Write the i18n json file
			await fs.writeFile(
				`./system/lang/${lang}.json`,
				JSON.stringify(i18njson, null, '\t') + '\n'
			)
		}
	}
}

doit().then(
	() => process.exit(),
	(err) => {
		console.error(err)
		process.exit(1)
	}
)
