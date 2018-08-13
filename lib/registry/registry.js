'use strict'

const data = require('./data')

const putFunctions = (db, req, res, dist) => {
  const { body } = req
  const functions = (body.functions || []).map(f => Object.assign({}, f, {
    servicePath: `${f.servicePath}${dist}`,
  }))
  // TODO: validate
  data.putFunctions(db, functions)

  return res.status(200).send()
}

module.exports = {
  putFunctions,
}
