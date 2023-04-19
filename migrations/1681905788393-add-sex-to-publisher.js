'use strict'
require('dotenv').config()

const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

const MONGO_URI = process.env.MONGO_URI

module.exports.up = async function (next) {

  const client = await MongoClient.connect(MONGO_URI, { useUnifiedTopology: true })
  const db = client.db()
  const collection = db.collection('publishers')
  await collection.updateMany({}, { $set: { sex: 'male' } })
  await client.close()
  next()
}

module.exports.down = async function (next) {
  const client = await MongoClient.connect(MONGO_URI, { useUnifiedTopology: true })
  const db = client.db()
  const collection = db.collection('publishers')
  await collection.updateMany({}, { $unset: { sex: "" } })
  await client.close()
  next()

}
