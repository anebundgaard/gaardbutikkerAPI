// Kald til server
const User = require('../models/user.model'); 
const express = require('express');
const router = express.Router(); 

// Håndterer formdata (POST, PUT)
const formData = require('express-form-data');
router.use(formData.parse());

// POST - Login 
router.post('/', async(req, res) => {
    console.log('POST/Login')

    try {
        const {email, password} = req.body; // Email og password fra request bliver gemt som variabler

        const user = await User.findOne({email:email}) // Leder efter bruger med email som macther medsendt i request 

        // Hvis der ikke blev fundet et bruger match på email
        if(!user){
            return res.status(401).json({message:"Brugeren findes ikke ud fra email"})
        }

        // Vi kalder på comparePassword, som ligger i user.model
        user.comparePassword(password, function (err, isMatch){
            if (err) throw err;
            if (isMatch){
                // Kald på session cookie i serveren
                req.session.userId = user._id; // 

                // Svar retur
                res.status(200).json({message:"Login lykkes", navn:user.navn, user_id:user._id})
            } else {
                // Clearcookie
                return res.status(401).json({message:"Password matcher ikke bruger"})
            }
        })

    } catch (error) {
        console.log('Fejl:', error);
        return res.status(500).json({message:'Problemer med serveren'});
    }
}) 

// GET - Log ud
router.get('/logud', async(req, res) => {
    console.log('GET/Logud')

    // Slet session på server
    req.session.destroy(err => {
        // Fejl i destroy af session
        if(err) return res.status(500).json({message:'Logud mislykkedes'})

        // Få browseren til at clear/slette cookie
        res.clearCookie(process.env.SESSION_NAME).json({message:'Du er logget ud'})
    })
})

// GET - Logged in status
router.get('/loggedin', async(req, res) => {
    console.log('GET/Logged in...')

    if (req.session.userId) {
        return res.status(200).json({message:'Login er stadig aktivt', login:true})
    } else {
        return res.status(401).json({message:'Login er udløbet eller eksisterer ikke', login:false})
    }
})

module.exports = router; 

/*
USER ID: 
email: lasse@mail.dk
password: abcd1234
name: Lasse
Kryp: $2b$10$kyJwzyKqk2dW1sxBC/S98Oa4gw80df2KUqiHrsViillJkHtQm5Qw2
user_id = 614355d0315705a15a1bd37d
*/