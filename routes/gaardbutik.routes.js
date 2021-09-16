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

// GET - Søg efter en gaardbutik
router.get('/search/:searchkey', async(req, res) => {
    console.log('GET/Hent gaardbutik ud fra søgning', req.params.searchkey)

    try {
        let gaardbutik = await Gaardbutik.find({
            $or: [
                {"navn":{$regex:req.params.searchkey,$options:"i"}}, 
                {"adresse":{$regex:req.params.searchkey,$options:"i"}}, 
                {"beskrivelse":{$regex:req.params.searchkey,$options:"i"}}
            ]
        }); 
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

// PUT - Ret i en gaardbutik ud fra ID
router.put('/admin/:id', upload.single('image'), async(req, res) => {
    console.log("PUT - Ret i en gaardbutik")

    try {
        // Hvis der uploades et nyt billede, erstatter det nye billede det gamle billednavn
        if(req.file) {
            req.body.image = req.file.filename;
        
            const gammelGaardbutik = await Gaardbutik.findById(req.params.id);
            fs.unlink('public/images/' + gammelGaardbutik.billede, (err) => {
                if(err) throw err; 
                console.log("Billedet er slettet")
            })
        }

        // Det rettede produkt
        let gaardbutik = await Gaardbutik.findByIdAndUpdate({_id: req.params.id}, req.body, {new:true})
        res.status(201).json({message:'Gaardbutikken er rettet', oprettet:gaardbutik})
    } catch (error) {
        res.status(400).json({message:'Der er sket en fejl'})
    }
})

// DELETE - Slet en gaardbutik
router.delete('/admin/:id', async(req, res) => {
    console.log('GET/Slet en udvalgt gaardbutik')

    try {
        await Gaardbutik.findByIdAndDelete(req.params.id); 
        return res.status(200).json({message:'Du har nu slettet gaardbutikken'}); 

    } catch (error) {
        console.log('Fejl:', error);
        return res.status(500).json({message:'Problemer med serveren'});

    }
}) 

module.exports = router;