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

// SESSION
const MongoStore = require ('connect-mongo'); 

// ROUTES
app.get('/', async(req, res) => {
    console.log('serverens endpoint');
    return res.status(200).json({message:'Hilsen fra serveren'});
}) // Håndtering af request

// EKSPORTERING AF ROUTES
app.use('/gaardbutikker', require('./routes/gaardbutik.routes'))





