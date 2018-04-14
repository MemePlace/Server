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

    if (!body.password) {
        return res.status(400).json({error: 'You must fill in a password'});
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
        const msg = (err && err.errors && err.errors[0] && err.errors[0].message) || 'Failed to create user';

        res.status(400).json({error: msg});
    });
});

/**
 * Gets summary details about a user
 */
router.get('/:username', async (req, res) => {
    const username = req.params.username;
    let user;

    try {
        user = await models.User.find({
            attributes: ['username', 'createdAt'],
            where: models.sequelize.where(models.sequelize.fn('lower', models.sequelize.col('username')), username.toLowerCase())
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
/**
 * Check if username is taken
 */
router.get('/:username/exists', async (req, res) => {
   const username = req.params.username; 

   const exists = await models.User.findOne({
      where: models.sequelize.where(models.sequelize.fn('lower', models.sequelize.col('username')), username.toLowerCase())
   });

   res.json({exists: !!exists});
});

/**
 * Check if email is taken
 */
router.get('/:email/exists', async (req, res) => {
   const email = req.params.email || ''; 

   const exists = await models.User.findOne({
      where: models.sequelize.where(models.sequelize.fn('lower', models.sequelize.col('email')), email.toLowerCase())
   });

   res.json({exists: !!exists});
});

module.exports = router;
