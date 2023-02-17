const fs = require('fs').promises
const YAML = require('yaml')
const _ = require('lodash')
const { marked } = require('marked')

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
    const { rootKey, languages } = YAML.parse(contents)

    for (const { lang, entries } of languages ?? []) {
      console.log(`  - ${lang}`)

      // Load the i18n json file
      const i18njson = JSON.parse(
        await fs.readFile(`./system/lang/${lang}.json`)
      )

      // Update the entries
      for (const entry of entries) {
        const description = entry.mdDescription
          ? marked
              .parse(entry.mdDescription)
              .replace(/<\/p>\n<p>/g, '</p><p>')
              .trim()
          : entry.plainDescription ?? ''
        _.set(i18njson, `${rootKey}.${entry.key}Title`, entry.title)
        _.set(i18njson, `${rootKey}.${entry.key}Content`, description)
      }

      // Write the i18n json file
      await fs.writeFile(
        `./system/lang/${lang}.json`,
        JSON.stringify(i18njson, null, 2)
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
