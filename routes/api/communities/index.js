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
router.put('/:name/favourite', auth.isAuthenticated, async (req, res) => {
    // get community
    const community = models.Community.findOne({
        where: {
            name: req.params.name
        }
    });

    if (!community) {
        return res.status(400).json({error: 'Failed to find the community'});
    }

    models.Favourite.create({
        userId: req.session.userId,
        communityId: community.id
    }).then((favourite) => {
        res.json({message: 'Successfully favourited the community'});
    }).catch((err) => {
        res.status(500).json({error: 'Failed to favourite the community'});
    })
});

/**
 * Deletes community favourite
 */
router.delete('/:name/favourite', auth.isAuthenticated, (req, res) => {
    // get community
    const community = models.Community.findOne({
        where: {
            name: req.params.name
        }
    });

    if (!community) {
        return res.status(400).json({error: 'Failed to find the community'});
    }

    models.Favourite.destroy({
        where: {
            userId: req.session.userId,
            communityId: community.id
        }
    }).then(() => {
        res.json({message: 'Successfully unfavourited the community'});
    }).catch((err) => {
        res.status(500).json({error: 'Failed to unfavourite the community'})
    })
});

/**
 * Retrieves memes in community
 */
router.get('/:name/memes', (req, res) => {
    const sort = req.query.sort || 'top';
    const after = req.query.after;
    const count = req.query.count || 10;

    // TODO
});

/**
 * Retrieves templates used in the community
 */
router.get('/:name/templates', (req, res) => {
    const sort = req.query.sort || 'top';
    const after = req.query.after;
    const count = req.query.count || 10;

    // TODO
});

module.exports = router;
