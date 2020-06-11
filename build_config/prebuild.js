var json = require('../package.json');
var fs = require('fs');
var path = require('path');

var txt = `
var version = "${json.version}";

module.exports = version;
`

var f = path.resolve(process.cwd(), "build_config", 'version.js');

fs.writeFileSync(f, txt);