// Kald til server
const express = require('express');
require('dotenv').config();
const cors = require('cors')
const mongoose = require('mongoose'); 

const app = express(); // Vi bygger serveren App
const PORT = process.env.PORT; // Vi kalder på vores server i .env

// Kald til database
mongoose.connect(process.env.DB_URL, {useNewUrlParser:true, useUnifiedTopology:true}) // Lokal DB
const db = mongoose.connection; // Skaber forbindelse til MongoDB
db.on('error', (error) => console.log('Fejl:' + error)) // Håndterer fejl
db.once('open', () => console.log('/// --> MongoDB er klar')) // Hvis ingen fejl, åben forbindelse til DB
app.listen(PORT, () => 
    console.log('/// --> Serveren lytter på port:' + PORT)
)

// APP
app.use(express.json()); // Håndterer JSON
app.use(express.urlencoded({extended:true})); // Håndterer POST/PUT som urlencoded-data
app.use(cors({credentials:true, origin:true})) // CORS 
app.use(express.static('public')) // Håndterer import af uploadede filer

// SESSION / COOKIE
const MongoStore = require ('connect-mongo'); 
const session = require('express-session');
const expire = 1000 * 60; // Cookie expire
app.use(session({
    name:process.env.SESSION_NAME,
    resave: true, 
    rolling:false, 
    // Hvis resave=true og rolling=true, så fornys session ved hvert request
    // Hvis resave=true og rolling=false, så er expire fast
    saveUninitialized:false, 
    store:MongoStore.create({mongoUrl:process.env.DB_URL}),
    secret: process.env.SESS_SECRET,
    cookie:{ 
        maxAge: expire,
        sameSite:'strict', 
        secure:false, 
        httpOnly:true // Gør, at session cookie ikke kan manipuleres med javascript eller andet 
    }
}));

// AUTHENTIFICATION CONTROL
app.use('*/admin*', async (req, res, next) => {
    // if (hvis bruger er logget ind), else (hvis ikke)
    if (req.session && req.session.userId){
        // Fortsæt videre...
        return next();
    } else {
        console.log("Login afvist")
        return res.status(401).json({message:'Du har ikke adgang'})
    }

})

// ROUTES
app.get('/', async(req, res) => {
    console.log('serverens endpoint');
    return res.status(200).json({message:'Hilsen fra serveren'});
}) // Håndtering af request

// EKSPORTERING AF ROUTES
app.use('/gaardbutikker', require('./routes/gaardbutik.routes'))
app.use('/user', require('./routes/user.routes'))
app.use('/login', require('./routes/login.routes'))




