const express = require('express');
const app = express();
const mongoose = require('mongoose');
const db = require("./confg/keys").mongoURI; 
const bodyParser = require('body-parser');
const passport = require('passport');


// middleware
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(passport.initialize());
require('./confg/passport')(passport);


// controllers
const usersController = require('./controllers/api/users');
const tweetsController = require('./controllers/api/tweets');


mongoose
    .connect(db, { useNewUrlParser: true })
    .then( () => console.log("Connected to mongoDB"))
    .catch(err => console.log(err));


app.get('/', (req, res) => {
    res.send('home route nodemon')
});

// url prefixes
app.use('/api/users', usersController);
app.use('/api/tweets', tweetsController);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`app.js listening on port ${PORT}`);
});