import fs from 'fs'

console.log(JSON.parse(fs.readFileSync('system/system.json', 'utf8')).version)
