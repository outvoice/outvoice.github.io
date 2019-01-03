const execa = require('execa')
const { minify } = require('./minify.js')

console.log('hosting on now...')
execa('now')
  .then(async ({ stdout: url }) => {
    console.log('hosted at', url)

    console.log('minifing...')
    await minify({ url })

    console.log('deploy on github pages')
    await execa('git', ['add', 'index.html'])
    await execa('git', ['commit', '-m', 'generate optimised index.html'])
    await execa('git', ['push'])

    console.log('done !')
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
