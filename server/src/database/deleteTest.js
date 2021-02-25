const fs = require('fs')
const { resolve } = require('path')

try {
	fs.unlinkSync(resolve(__dirname, 'database.test.sqlite'))
} catch (error) {}
