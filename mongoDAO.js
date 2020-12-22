const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';

const dbName = 'headsOfStateDB'
const collName = 'headsOfState'

var headsOfStateDB
var headsOfState
//connects my mongo database to my project
MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((client) => {
        headsOfStateDB = client.db(dbName) //connects to specific database
        headsOfState = headsOfStateDB.collection(collName)
    })
    .catch((error) => {
        console.log(error)
    })


var getHeadsOfState = function () {
    return new Promise((resolve, reject) => {
        var cursor = headsOfState.find()
        cursor.toArray()
            .then((documents) => {
                resolve(documents)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

var addHeadsOfState = function (_id, headOfState) {
    return new Promise((resolve, reject) => {
        headsOfState.insertOne({ "_id": _id, "headOfState": headOfState })
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

var deleteHeadsOfState = function (_id) {
    return new Promise((resolve, reject) => {
        headsOfState.remove({ "_id": _id })
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}


module.exports = { getHeadsOfState, addHeadsOfState, deleteHeadsOfState }