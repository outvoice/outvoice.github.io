const { invoices } = require('./db.js')
const { json } = require('./serve.js')

module.exports = json(async data => ({
  id: await invoices.set({
    createdAt: new Date(),
    ...data,
  }),
}))
