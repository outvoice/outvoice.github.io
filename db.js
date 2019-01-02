const { MongoClient } = require('mongodb')
const user = {
  name: process.env.DBNAME,
  pass: process.env.DBPASS,
}

const server = `${process.env.DBURL}/test?retryWrites=true`
const uri = `mongodb+srv://${user.name}:${user.pass}@${server}`
const client = new MongoClient(uri, { useNewUrlParser: true })
process.on('SIGINT', () => client.close(() => process.exit(0)))

const collection = new Promise((s, f) =>
  client.connect(
    err => (err ? f(err) : s(client.db('test').collection('devices'))),
  ),
)

module.exports = async (req, res) => {
  return `The time is ${await Promise.resolve(new Date())}`
}
