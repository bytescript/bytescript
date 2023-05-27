const deasync = require('deasync')

function importSyncImpl(specifier, callback) {
	import(specifier)
		.then(mod => callback(null, mod))
		.catch(err => callback(err))
}

const importSync = deasync(importSyncImpl)

module.exports = importSync('./out/extension.js')
