const execa = require('execa')
const { minify } = require('./minify.js')

minify().catch(err => {
  console.error(err)
  process.exit(1)
})
