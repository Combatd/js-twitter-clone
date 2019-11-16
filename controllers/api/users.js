const express = require('express');
const router = express.Router();

router.get('/test', (req, res) => {
    res.json({ message: "this is the user route"} );
});




module.exports = router;