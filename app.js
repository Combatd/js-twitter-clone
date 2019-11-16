const express = require('express');
const app = express();
const mongoose = require('mongoose');
const db = require("./confg/keys").mongoURI; 


mongoose
    .connect(db, { useNewUrlParser: true })
    .then( () => console.log("Connected to mongoDB"))
    .catch(err => console.log(err));


app.get('/', (req, res) => {
    res.send('home route nodemon')
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`app.js listening on port ${PORT}`);
});