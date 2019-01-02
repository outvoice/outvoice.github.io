const { MongoClient, ObjectID } = require('mongodb')
const user = {
  name: process.env.DBUSER,
  pass: process.env.DBPASS,
}

const server = `${process.env.DBURL}/outvoice?retryWrites=true`
const uri = `mongodb+srv://${user.name}:${user.pass}@${server}`
const db = MongoClient.connect(
  uri,
  { useNewUrlParser: true },
).then(async client => {
  process.on('SIGINT', () => client.close(() => process.exit(0)))
  return client.db('outvoice').collection('invoices')
})

const toHex = n => n.toString(16).padStart(2, '0')
const fromHex = s => parseInt(s, 16)
const decodeId = id => [...Buffer.from(id, 'base64')].map(toHex).join('')
const encodeId = id =>
  Buffer.from(
    String(id)
      .match(/.{2}/g)
      .map(fromHex),
  ).toString('base64')

module.exports.invoices = {
  set: async data => encodeId((await (await db).insertOne(data)).insertedId),
  get: async id => (await db).findOne(new ObjectID(decodeId(id))),
}
