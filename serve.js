const { json } = require('micro')
const serve = parser => handler => async (req, res) => {
  try {
    res.end(JSON.stringify(await handler(await parser(req))))
  } catch (err) {
    return res.end(`{"error":${JSON.stringify(err.message)}}`)
  }
}

module.exports.json = serve(json)
module.exports.url = serve(req => {
  const params = {}
  for (const [k, v] of new URLSearchParams(new URL(req.url).search)) {
    params[k] = v
  }
  return params
})
