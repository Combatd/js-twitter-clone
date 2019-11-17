const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const keys = require('../../confg/keys');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const User = require('../../models/User');

router.post("/register", (req, res) => {
  


    User.findOne({ handle: req.body.handle }).then(user => {
        if (user) {
            return res.status(400).json({ user: "user already exists"});
        } else {
            const newUser = new User({
                handle: req.body.handle,
                email: req.body.email,
                password: req.body.password
            });

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser
                        .save()
                        .then(user => {
                            const payload = { id: user.id, handle: user.handle };

                            jwt.sign(payload, keys.secretOrKey, 
                                { expiresIn: 3600 }, 
                                (err, token) => {
                                res.json({
                                    success: true,
                                    token: "Bearer " + token
                                });
                            });
                        })
                        .catch(err => console.log(err));
                });
            });
        }
    });
});


router.post("/login", (req, res) => {

    const handle = req.body.handle;
    const password = req.body.password;

    User.findOne({ handle }).then(user => {
        if (!user) {
            return res.status(400).json({ handle: "Incorrect Handle or Password"});
        }

        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                const payload = { id: user.id, handle: user.handle };

                jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
                    res.json({
                        success: true,
                        token: "Bearer " + token
                    });
                });
            } else {

                return res.status(400).json({ password: "Incorrect Handle or Password"});
            }
        });
    });
});



router.get('/test', (req, res) => {
    res.json({ message: "this is the user route"} );
});




module.exports = router;