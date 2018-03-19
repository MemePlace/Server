const express = require('express');
const bcrypt = require('bcrypt');
const models = require('../models');
const utils = require('../utils');
const router = express.Router();

/**
 * Middleware to check whether the user is authed
 */
router.isAuthenticated = function(req, res, next) {
    if (req.session && req.session.userId && req.session.username && req.session.email) {
        next();
    } else {
        res.status(401).json({error: 'You must be authenticated to interact with this resource'});
    }
};

/**
 * Authenticate user credentials
 */
router.post('/', async (req, res) => {
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({error: 'Invalid request parameters'});
    }

    const user = await models.User.findOne({
        where: {
            username: req.body.username
        }
    });

    if (!user) {
        return res.status(400).json({error: 'Invalid username'});
    }

    const valid = await bcrypt.compare(req.body.password, user.password);

    if (!valid) {
        return res.status(400).json({error: 'Invalid password'});
    }

    // Valid credentials, log them in
    req.session.userId = user.id;
    req.session.username = user.username;
    req.session.email = user.email;

    const userDetails = await utils.getPrivateUserDetails(user.username);

    if (userDetails) {
        res.json(userDetails);
    } else {
        res.json((({id, username}) => ({id, username}))(user));
    }
});

/**
 * Logs out authenticated user
 */
router.put('/logout', router.isAuthenticated, async (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            res.status(500).json({error: 'Failed to logout user'});
        }
        else {
            res.json({message: 'Successfully logged out user'});
        }
    });
});

module.exports = router;
