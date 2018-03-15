const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

/**
 * Authenticate user credentials
 */
router.post('/', (req, res) => {
    res.send('Main APIv1 Page');
});

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

module.exports = router;
