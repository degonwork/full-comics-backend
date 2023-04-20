'use strict'
require('dotenv').config()

const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

const MONGO_URI = process.env.MONGO_URI

module.exports.up = async function (next) {

  const client = await MongoClient.connect(MONGO_URI, { useUnifiedTopology: true })
  const db = client.db()
  const collection = db.collection('publishers')
  await collection.updateMany({}, { $set: { age: 0, sex: 'male' } })
  await client.close()
  next()
}

module.exports.down = async function (next) {
  const client = await MongoClient.connect(MONGO_URI, { useUnifiedTopology: true })
  const db = client.db()
  const collection = db.collection('publishers')
  await collection.updateMany({}, { $unset: { age: "", sex: "" } })
  await client.close()
  next()

}


// npm i -g migrate --save
//Tạo 
// migrate create <name>
// Chạy để thêm
// migrate up
// migrate up : migrates/<name>
// Chạy để xóa
// migrate down
// migrate down : migrates/<name>