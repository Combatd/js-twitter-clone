const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('home route works')
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`app.js listening on port ${PORT}`);
});