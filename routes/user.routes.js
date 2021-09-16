const User = require('../models/user.model'); 
const express = require('express');
const router = express.Router(); 

// Håndterer formdata (POST, PUT)
const formData = require('express-form-data');
router.use(formData.parse()); 

// POST - Opret bruger
router.post('/', async(req, res) => {
    console.log('POST/Opret ny bruger')

    try {
        let user = new User(req.body); 

        await user.save(); // Gem i DB
        return res.status(200).json({message:'Der er oprettet en ny bruger', oprettet:user});

    } catch (error) {
        console.log('Fejl:', error);
        return res.status(500).json({message:'Problemer med serveren'});
    }
}) 

// PUT - Ret i en bruger
router.put('/admin/:id', async(req, res) => {
    console.log('PUT/Ret brugeroplysninger')

    try {
        let user = await User.findByIdAndUpdate({_id:req.params.id}, req.body, {new:true}); 

        await user.save(); 
        return res.status(200).json({message:'Der er rettet i brugeroplysninger', rettet:user});

    } catch (error) {
        console.log('Fejl:', error);
        return res.status(500).json({message:'Problemer med serveren'});

    }
}) 

// DELETE - Slet en bruger
router.delete('/admin/:id', async(req, res) => {
    console.log('GET/Slet en bruger')

    try {
        await User.findByIdAndDelete(req.params.id); 
        return res.status(200).json({message:'Du har nu slettet brugeren'}); 

    } catch (error) {
        console.log('Fejl:', error);
        return res.status(500).json({message:'Problemer med serveren'});

    }
})

module.exports = router; 