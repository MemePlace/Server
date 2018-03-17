const express = require('express');
const bcrypt = require('bcrypt');
const config = require('../../../config');
const auth = require('../auth');
const models = require('../models');
const router = express.Router();

/**
 * Creates new user
 */
router.post('/', (req, res) => {
    const body = req.body;

    if (!body.username || !body.password || !body.email) {
        return res.status(400).json({error: 'Invalid request properties'});
    }

    bcrypt.hash(body.password, config.bcrypt.saltRounds).then((hash) => {
        return models.User.create(Object.assign(req.body, {password: hash}));
    }).then((user) => {
        req.session.userId = user.id;
        req.session.username = user.username;
        req.session.email = user.email;

        // Only send back the user id and username
        res.json((({id, username}) => ({id, username}))(user));
    }).catch((err) => {
        res.status(500).json({error: 'Failed to create user'});
    });
});

/**
 * Gets details about user
 */
router.get('/:username', (req, res) => {
    // TODO: Retrieve user details (provide more details if it is the logged in user)
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

    // TODO: Update user details
    res.send(req.params.username);
});

module.exports = router;
