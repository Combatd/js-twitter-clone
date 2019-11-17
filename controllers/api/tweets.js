const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const validateTweetInput = require('../../validation/tweets');
const Tweet = require('../../models/Tweet');


router.get('/test', (req, res) => {
    res.json({ message: "this is the tweet route" });
});

// tweet - create
router.post('/', 
passport.authenticate('jwt', { session: false }), 
(req, res) => {
    // object destructuring
    const { isValid, errors } = validateTweetInput(req.body);

    if(!isValid) {
        return res.status(400).json(errors);
    }

    const newTweet = new Tweet( {
        user: req.user.id,
        text: req.body.text
    });    

});


module.exports = router;