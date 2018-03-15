const express = require('express');
const router = express.Router();

/**
 * Authenticate user credentials
 */
router.post('/', (req, res) => {
    res.send('Main APIv1 Page');
});

module.exports = router;
