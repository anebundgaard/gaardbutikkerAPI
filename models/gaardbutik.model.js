const mongoose = require('mongoose');

const gaardbutikSchema = new mongoose.Schema({
    navn:{
        type:String,
        required:[true, 'Husk at tilføje navn på gaardbutikken']
    },
    adresse:{
        type:String,
        required:[true, 'Husk at indtaste adresse']
    },
    beskrivelse:{
        type:String,
        required:[true, 'Skriv en kort beskrivelse af din gaardbutik']
    },
    billede:{
        type:String, //Billedets navn i DB
        required:[true, 'Husk at tilføje et billede til din gaardbutik']
    }
})

module.exports = mongoose.model('Gaardbutik', gaardbutikSchema, 'gaardbutikker') 

