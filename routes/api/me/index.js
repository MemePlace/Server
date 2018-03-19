const express = require('express');
const auth = require('../auth');
const models = require('../models');
const utils = require('../utils');
const router = express.Router();


/**
 * Returns summarized data on the currently logged in user
 */
router.get('/', auth.isAuthenticated, async (req, res) => {
    let user;

    try {
        user = await utils.getPrivateUserDetails(req.session.username);
    } catch (e) {
        return res.status(500).json({error: 'Error while retrieving user'});
    }

    if (user) {
        res.json(user);
    } else {
        res.status(400).json({error: 'Failed to retrieve user'});
    }
});

/**
 * Updates logged in user details
 */
router.put('/', auth.isAuthenticated, (req, res) => {
    // TODO: Update user details
    res.status(500).json({error: 'Method not implemented'});
});

module.exports = router;
