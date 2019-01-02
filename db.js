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

const replacer = (rgx, map) => (fn => s => s.replace(rgx, fn))(c => map[c])
const urlSafeEncode = replacer(/[+/=]/g, { '+': '-', '/': '_', '=': '.' })
const urlSafeDecode = replacer(/[-_.]/g, { '-': '+', _: '/', '.': '=' })
const toHex = n => n.toString(16).padStart(2, '0')
const fromHex = s => parseInt(s, 16)
const decodeId = id =>
  [...Buffer.from(urlSafeDecode(id), 'base64')].map(toHex).join('')
const encodeId = id =>
  urlSafeEncode(
    Buffer.from(
      String(id)
        .match(/.{2}/g)
        .map(fromHex),
    ).toString('base64'),
  )

module.exports.invoices = {
  set: async data => encodeId((await (await db).insertOne(data)).insertedId),
  get: async id => {
    const decoded = decodeId(id)
    let obj
    try {
      obj = new ObjectID(decoded)
    } catch (err) {
      return null
    }
    const data = await (await db).findOne(obj)
    if (!data) return null
    data._id = undefined
    return data
  },
}
