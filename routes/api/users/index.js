const express = require('express');
const router = express.Router();

/**
 * Creates new user
 */
router.post('/', (req, res) => {
    res.json(req.body);
});

/**
 * Gets details about user
 */
router.get('/:user', (req, res) => {
    res.send(req.params.user);
});

/**
 * Updates user details
 */
router.put('/:user', (req, res) => {
    res.send(req.params.user);
});

module.exports = router;
