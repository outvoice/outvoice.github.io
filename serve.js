const { json } = require('micro')

module.exports.json = handler => async (req, res) => {
  try {
    return handler(await json(req))
  } catch (err) {
    console.log(err.stack)
    return { error: err.toString() }
  }
}
