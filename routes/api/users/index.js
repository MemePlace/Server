const express = require('express');
const auth = require('../auth');
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
router.get('/:username', (req, res) => {
    res.send(req.params.username);
});

/**
 * Updates user details
 */
router.put('/:username', auth.isAuthenticated, (req, res) => {
    // Ensure they are the user they're updating
    if (req.session.username !== req.params.username) {
        return res.status(401).json({error: 'Unauthorized access to update this resource'});
    }

    res.send(req.params.username);
});

module.exports = router;
