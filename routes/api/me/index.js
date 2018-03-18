const express = require('express');
const auth = require('../auth');
const models = require('../models');
const router = express.Router();

/**
 * Returns summarized data on the currently logged in user
 */
router.get('/', auth.isAuthenticated, async (req, res) => {
    let user;

    try {
        user = await models.User.find({
            attributes: ['username'],
            where: {
                username: req.session.username
            },
            include: [{
                model: models.Favourite,
                include: [{
                    model: models.Community,
                    attributes: ['name', 'title']
                }],
                attributes: ['CommunityId']
            }]
        });
    } catch (e) {
        return res.status(500).json({error: 'Error while retrieving user'});
    }

    if (user) {
        user.dataValues.Favourites = user.dataValues.Favourites.map((favourite) => favourite.Community);
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
