var mysql = require('promise-mysql');

var pool
//connects to mysql database to project
mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'NewPassword',
    database: 'geography'
})
    .then((result) => {
        pool = result
    })
    .catch((error) => {
        console.log(error)
    });

var getCity = function () {
    return new Promise((resolve, reject) => {
        pool.query("select * from city")
            .then((result) => {
                resolve(result)//prints info from database
            })
            .catch((error) => {
                reject("error")
            })
    })
}

//gets country from sql table and displays it
var getCountry = function () {
    return new Promise((resolve, reject) => {
        pool.query("select * from country")
            .then((result) => {
                resolve(result)//prints info from database
            })
            .catch((error) => {
                reject("error")
            })
    })
}
//gets city and country and joins them on co_code
var getCountryCity = function () {
    return new Promise((resolve, reject) => {
        pool.query("select * from city INNER JOIN country ON city.co_code = country.co_code")
            .then((result) => {
                resolve(result)//prints info from database
            })
            .catch((error) => {
                reject("error")
            })
    })
}

//adds new country to country sql table
var addCountry = function (countryCode, countryName, countryDetails) {
    return new Promise((resolve, reject) => {
        var myQuery = {
            // sql: 'insert into country values = ?',
            sql: 'insert into country Values (?, ?, ?)',
            values: [countryCode, countryName, countryDetails]
        }
        pool.query(myQuery)
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

//deleteCountry
var deleteCountry = function (countryCode) {
    return new Promise((resolve, reject) => {
        var myQuery = {
            sql: 'delete from country where co_code = ?',
            values: [countryCode]
        }
        pool.query(myQuery)
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

var updateCountry = function (countryCode, countryName, countryDetails) {
    return new Promise((resolve, reject) => {
        var myQuery = {
            // sql: 'insert into country values = ?',
            sql: 'UPDATE country SET co_name = ?, co_details = ? WHERE co_code = ?',
            values: [countryName, countryDetails, countryCode]
        }
        pool.query(myQuery)
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}



module.exports = { getCity, getCountry, addCountry, deleteCountry, updateCountry, getCountryCity }