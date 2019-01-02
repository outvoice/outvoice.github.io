const { invoices } = require('./db.js')
const { json } = require('./serve.js')

module.exports = json(async ({ id }) => invoices.get(id))
