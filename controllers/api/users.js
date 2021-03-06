const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const keys = require('../../confg/keys');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../../models/User');


const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

router.post("/register", (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

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
    const { errors, isValid } = validateLoginInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    const handle = req.body.handle;
    const password = req.body.password;

    User.findOne({ handle }).then(user => {
        if (!user) {
            return res.status(400).json(errors);
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

                return res.status(400).json(errors);
            }
        });
    });
});



router.get('/test', (req, res) => {
    res.json({ message: "this is the user route"} );
});




module.exports = router;