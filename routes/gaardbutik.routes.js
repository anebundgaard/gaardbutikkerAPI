const Gaardbutik = require('../models/gaardbutik.model'); // Endpoint
const express = require('express');
const router = express.Router(); 
const multer = require('multer');

// MULTER
const upload = multer({
    storage:multer.diskStorage({
        destination:function(req, file, cb){
            cb(null, 'public/images/')
        },
        filename:function(req, file, cb){
            // cb(null, file.originalname) // Vi bevarer det oprindelige filnavn
            cb(null, Date.now() + '-' + file.originalname) // Filen får et andet navn gang for gang 
        } 
    }) 
})

// GET - Hent alle gaardbutikker
router.get('/', async(req, res) => {
    console.log('GET/hent alle gaardbutikker')

    try {
        let gaardbutik = await Gaardbutik.find(); 
        return res.status(200).json(gaardbutik); 

    } catch (error) {
        console.log('Fejl:', error);
        return res.status(500).json({message:'Problemer med serveren'});

    }
}) 

// GET - Hent et udvalgt produkt ud fra ID
router.get('/:id', async(req, res) => {
    console.log('GET/hent en udvalgt gaardbutik')

    try {
        let gaardbutik = await Gaardbutik.findById(req.params.id); 
        
        return res.status(200).json(gaardbutik); 

    } catch (error) {
        console.log('Fejl:', error);
        return res.status(500).json({message:'Problemer med serveren'});

    }
}) 

// POST - Opret data
router.post('/admin', upload.single('billede'), async(req, res) => {
    console.log("POST - Gaardbutik")

    try {
        let gaardbutik = new Gaardbutik(req.body);
        gaardbutik.billede = req.file.filename; 
        gaardbutik = await gaardbutik.save(); 

        res.status(201).json({message:'Ny gaardbutik er oprettet', oprettet:gaardbutik})
    } catch (error) {
        res.status(400).json({message:'Der er sket en fejl'})
    }
})

module.exports = router;