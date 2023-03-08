const { execSync } = require('child_process')
const {
  promises: { readFile, writeFile },
} = require('fs')

async function doit() {
  const [_node, script, mode] = process.argv
  if (!['major', 'minor', 'patch'].includes(mode)) {
    console.error(`USAGE: node ${script} [major|minor|patch]`)
    process.exit(-1)
  }

  // Read in the system file
  const systemFile = await readFile('./system/system.json')
  const systemJson = JSON.parse(systemFile)

  // Calculate next version
  const { version } = systemJson
  const versionParts = version.split('.')
  if (mode === 'major') {
    versionParts[0]++
    versionParts[1] = '0'
    versionParts[2] = '0'
  }
  if (mode === 'minor') {
    versionParts[1]++
    versionParts[2] = '0'
  }
  if (mode === 'patch') {
    versionParts[2]++
  }
  const nextVersion = versionParts.join('.')

  // Write out system file
  systemJson.version = nextVersion
  systemJson.download = `https://github.com/ben/foundry-ironsworn/releases/download/${nextVersion}/ironsworn.zip`
  await writeFile(
    './system/system.json',
    JSON.stringify(systemJson, null, 2) + '\n'
  )

  // Update the changelog
  const changelog = (await readFile('./CHANGELOG.md')).toString()
  newChangelog = changelog.replace(
    '## Next Release',
    `## Next Release\n\n## ${nextVersion}`
  )
  await writeFile('./CHANGELOG.md', newChangelog)

  // Create a commit and a tag
  execSync('git add CHANGELOG.md system/system.json').toString()
  execSync(`git commit -m '${nextVersion}'`).toString()
  execSync(`git tag '${nextVersion}'`).toString()

  // Push to origin
  console.log(
    `DONE. Use 'git push origin main ${nextVersion}' to create a release.`
  )
}

doit().then(
  () => process.exit(),
  (err) => {
    console.error(err)
    process.exit(-1)
  }
)
