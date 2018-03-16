const express = require('express');
const bcrypt = require('bcrypt');
const models = require('../models');
const auth = require('../auth');
const router = express.Router();

/**
 * Creates community
 */
router.post('/', auth.isAuthenticated, (req, res) => {
    models.Community.create({
        name: req.body.name,
        title: req.body.title,
        description: req.body.description,
        sidebar: req.body.sidebar,
        nsfw: req.body.nsfw,
        creatorId: req.session.userId
    }).then((community) => {
        res.json(community);
    }).catch((err) => {
        console.log(err);
        res.status(400).json({error: err.toString()});
    });
});

/**
 * Retrieves community details
 */
router.get('/:name', async (req, res) => {
    const community = await models.Community.findOne({
        where: {
            name: req.params.name
        },
        attributes: {
            exclude: ['creatorId']
        },
        include: [{
            model: models.User,
            as: 'creator',
            attributes: ['username']
        }]
    });

    if (community) {
        res.json(community);
    } else {
        res.status(400).json({error: 'Failed to find the community'});
    }
});

/**
 * Favourites community
 */
router.put('/:name/favourite', auth.isAuthenticated, (req, res) => {

});

/**
 * Deletes community favourite
 */
router.delete('/:name/favourite', auth.isAuthenticated, (req, res) => {

});

/**
 * Retrieves memes in community
 */
router.get('/:name/memes', (req, res) => {
    const sort = req.query.sort || 'top';
    const after = req.query.after;
    const count = req.query.count || 10;
});

/**
 * Retrieves templates used in the community
 */
router.get('/:name/templates', (req, res) => {
    const sort = req.query.sort || 'top';
    const after = req.query.after;
    const count = req.query.count || 10;
});

module.exports = router;
