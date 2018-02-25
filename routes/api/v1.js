const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Main APIv1 Page');
});

module.exports = router;
