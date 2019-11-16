const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const User = require('../../models/User');

router.post('/register', (req, res) => {
    // check email has not been used to register before
    User.findOne({ email: req.body.email })
    .then( existingUser => {
        if(existingUser) {
            // throw error if email exists
            return res.status(400).json({email: "A user has already registered with this address"});
        } else { 
            
            const newUser = new User({
                handle: req.body.handle,
                email: req.body.email,
                password: req.body.password
            });
            console.log(newUser);


            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {

                    if (err) {
                        throw err;
                    }
                    newUser.password = hash;
                    newUser.save()
                        .then(user => res.json(user))
                        .catch(err => console.log(err));                  
                });
            });

        }
        
    })
});

router.post('/login', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const foundUser = await User.findOne( {email} )
        console.log(req.body);
        console.log(foundUser, " <- foundUser");

        if (foundUser) {
            
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        res.json({ msg: 'Success' });
                    } else {
                        return res.status(400).json({ password: 'Incorrect password' });
                    }
                })

        }

    } catch (err) {
        console.log(err);
        res.send(err);
    }

    // User.findOne({ email })
    //     .then(user => {
    //         if (!user) {
    //             return res.status(404).json({ email: 'This user does not exist' });
    //         }

    //         bcrypt.compare(password, user.password)
    //             .then(isMatch => {
    //                 if (isMatch) {
    //                     res.json({ msg: 'Success' });
    //                 } else {
    //                     return res.status(400).json({ password: 'Incorrect password' });
    //                 }
    //             })
    //     })
})


router.get('/test', (req, res) => {
    res.json({ message: "this is the user route"} );
});




module.exports = router;