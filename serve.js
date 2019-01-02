const { json } = require('micro')
const { URLSearchParams } = require('url')
const serve = parser => handler => async (req, res) => {
  try {
    res.end(`{"data":${JSON.stringify(await handler(await parser(req)))}}`)
  } catch (err) {
    return res.end(`{"error":${JSON.stringify(err.message)}}`)
  }
}

module.exports.json = serve(json)
module.exports.url = serve(req => {
  const [, search] = req.url.split('?')
  const params = {}
  if (!search) return params
  for (const [k, v] of new URLSearchParams(search)) {
    params[k] = v
  }
  return params
})
