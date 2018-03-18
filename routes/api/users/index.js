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
 * Gets summary details about a user
 */
router.get('/:username', async (req, res) => {
    let user;

    try {
        user = await models.User.find({
            attributes: ['username', 'createdAt'],
            where: {
                username: req.params.username
            }
        });
    } catch (e) {
        return res.status(500).json({error: 'Error while retrieving user'});
    }

    if (user) {
        res.json(user);
    } else {
        res.status(400).json({error: 'Failed to retrieve user'});
    }
});

module.exports = router;
