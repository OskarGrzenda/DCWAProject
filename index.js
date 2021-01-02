var express = require('express')
var mongoDAO = require('./mongoDAO')
var mySQLDAO = require('./mySQLDAO')
var bodyParser = require('body-parser')

//everything in express is in the app variable
var app = express();
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: false }))


//HOME PAGE
app.get('/', (req, res) => {

    res.render('showHomePage')

})


//MONGODB STUFF VVVVVVVV

//res = what you want to send back to the page
app.get('/headsOfState', (req, res) => {
    mongoDAO.getHeadsOfState()
        .then((documents) => {
            res.render('showHeadsOfState', { headsOfState: documents })
        })
        .catch((error) => {
            res.render(error)
        })
})

//addHeadsOfState
app.get('/addHeadsOfState', (req, res) => { //gets and displays the ejs file
    res.render("addHeadsOfState")
})

app.post('/addHeadsOfState', (req, res) => {
    mongoDAO.addHeadsOfState(req.body._id, req.body.headOfState)
        .then((result) => {
            res.redirect("/headsOfState")
        })
        .catch((error) => {
            if (error.message.includes("11000")) {
                res.send("Error: Head Of State with Country Code: " + req.body._id + " already exists")
            }
            else {
                res.send(error.message)
            }
        })
})

//deleteHeadsOfState
//Added this as an extra feature
app.get('/deleteHeadsOfState', (req, res) => { //gets and displays the ejs file
    res.render("deleteHeadsOfState")
})

app.post('/deleteHeadsOfState', (req, res) => {
    mongoDAO.deleteHeadsOfState(req.body._id)
        .then((result) => {
            res.redirect("/headsOfState")
        })
        .catch((error) => {
            if (error.message.includes("11000")) {
                res.send("Error: Head Of State with Country Code: " + req.body._id + " already exists")
            }
            else {
                res.send(error.message)
            }
        })
})
//MONGODB STUFF ^^^^^^^^^^^


//MYSQL STUFF VVVVVVVV

app.get('/city', (req, res) => {
    mySQLDAO.getCity()
        .then((result) => {
            res.render('showCity', { city: result })
        })
        .catch((error) => {
            res.send(error)
        })
})

app.get('/country', (req, res) => {
    mySQLDAO.getCountry()
        .then((result) => {
            res.render('showCountry', { country: result })
        })
        .catch((error) => {
            res.render(error)
        })
})

//AddCountry
app.get('/addCountry', (req, res) => { //gets and displays the ejs file
    res.render("addCountry")
})

app.post('/addCountry', (req, res) => {
    mySQLDAO.addCountry(req.body.countryCode, req.body.countryName, req.body.countryDetails)//adds info from ejs file to database
        .then((result) => {
            res.redirect("/country")//redirects to page country
        })
        .catch((error) => {
            //ERROR 1062 (23000): Duplicate entry 'NOR' for key 'country.PRIMARY'
            if (error.message.includes("country.PRIMARY")) {
                res.send("<h3>Error: Country with country code: " + req.body.countryCode + " already exists</h3>")
            }
            else {
                res.send(error.message)
            }
            res.send(error)
        })
})


//DeleteCountry
app.get('/deleteCountry', (req, res) => { //gets and displays the ejs file
    res.render("deleteCountry")
})
//needs to be post to read from deleteCountry.ejs
app.post('/deleteCountry', (req, res) => {
    mySQLDAO.deleteCountry(req.body.countryCode)
        .then((result) => {
            if (result.affectedRows == 0) {
                res.send("<h3>Country:" + req.body.countryCode + " doesn't exist</h3>")
            } else {
                res.send("<h3>Country: " + req.body.countryCode + " deleted</h3>" + "<button type=button><a href=http://localhost:3000/>HOME</a></button>")
            }
        })
        .catch((error) => {
            if (error.code == "ER_ROW_IS_REFERENCED_2") {
                res.send("<h3>ERROR: " + error.errno + " cannot delete country with country code " + req.body.countryCode + " as it referenced by foreign key and has cities</h3>" + "<button type=button><a href=http://localhost:3000/>HOME</a></button>")
            } else {
                res.send("<h3>ERROR: " + error.errno + " " + error.sqlMessage + "</h3>")
            }
        })
})


//updateCountry
app.get('/updateCountry', (req, res) => { //gets and displays the ejs file
    res.render("updateCountry")
})

app.post('/updateCountry', (req, res) => {
    mySQLDAO.updateCountry(req.body.countryCode, req.body.countryName, req.body.countryDetails)//adds info from ejs and sends to function
        .then((result) => {
           res.redirect("/country")//redirects to page country
        })
        .catch((error) => {
            res.send(error)
        })
})


//allCityDetails
app.get('/showAllDetails', (req, res) => {
    mySQLDAO.getCountryCity()
        .then((result) => {
            res.render('showAllDetails', { city: result })
        })
        .catch((error) => {
            res.send(error)
        })
})

//MYSQL STUFF ^^^^^^^^^^^

app.listen(3000, () => {
    console.log("Listening on port 3000")
})