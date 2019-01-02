const { json } = require('micro')
const serve = parser => handler => async (req, res) => {
  try {
    return handler(await parser(req))
  } catch (err) {
    return { error: err.toString() }
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
