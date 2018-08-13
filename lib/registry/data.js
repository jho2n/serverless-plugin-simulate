'use strict'

const BbPromise = require('bluebird')
const low = require('lowdb')
const FileAsync = require('lowdb/adapters/FileSync')

const FUNCTIONS_KEY = 'functions'
const DATA_VERSION = 1

const createDb = (dbPath) => {
  const adapter = new FileAsync(dbPath)
  const db = low(adapter)

  db.defaults({
    [FUNCTIONS_KEY]: {},
  }).write()

  return db
}

const getFunction = (db, functionIdentifier) => {
  const func = db
    .get(FUNCTIONS_KEY)
    .get(functionIdentifier)
    .value()
  return func
    ? BbPromise.resolve(func.config)
    : BbPromise.reject(new Error(`Cannot find function ${functionIdentifier}`))
}

const putFunction = (db, functionConfig) => db
  .get(FUNCTIONS_KEY)
  .set(functionConfig.key, {
    version: DATA_VERSION,
    config: functionConfig,
  })
  .write()

const putFunctions = (db, functions) => functions
  .reduce(
    (op, func) => op.set(func.key, {
      version: DATA_VERSION,
      config: func,
    }),
    db.get(FUNCTIONS_KEY)
  )
  .write()

module.exports = {
  createDb,
  getFunction,
  putFunction,
  putFunctions,
}
