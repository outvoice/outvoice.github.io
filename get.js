const { invoices } = require('./db.js')
const { url } = require('./serve.js')

module.exports = url(async ({ id }) => invoices.get(id))
