var fs = require('fs')
console.log(JSON.parse(fs.readFileSync('system/system.json', 'utf8')).version)
