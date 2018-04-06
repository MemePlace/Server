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
        const msg = (err && err.errors && err.errors[0] && err.errors[0].message) || 'Failed to create community';
        res.status(400).json({error: msg});
    });
});

/**
 * Gets lists of communities
 */
router.get('/', async (req, res) => {
    const sort = (['top', 'new'].includes(req.query.sort) && req.query.sort) || 'top';
    const count = (0 < parseInt(req.query.count) && parseInt(req.query.count) < 100) ? parseInt(req.query.count) : 10;
    const offset = parseInt(req.query.offset) || 0;

    let order;

    if (sort === 'top') {
        order = ['favourites', 'DESC']
    }
    else if (sort === 'new') {
        order = ['createdAt', 'DESC'];
    }

    const totalCount = await models.Community.count();

    const communities = await models.Community.findAll({
        limit: count,
        offset,
        order: [order]
    });

    res.json({
        communities,
        totalCount,
        offset,
        size: communities.length,
        sort
    });
});

/**
 * Retrieves community details
 */
router.get('/:name', async (req, res) => {
    const name = req.params.name;

    const community = await models.Community.findOne({
        where: models.sequelize.where(models.sequelize.fn('lower', models.sequelize.col('name')), name.toLowerCase()),
        include: [{
            model: models.User,
            as: 'creator',
            attributes: ['username']
        }],
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
    const name = req.params.name;

    const community = await models.Community.findOne({
        where: models.sequelize.where(models.sequelize.fn('lower', models.sequelize.col('name')), name.toLowerCase()),
    });

    if (!community) {
        return res.status(400).json({error: 'Failed to find the community'});
    }

    models.Favourite.create({
        UserId: req.session.userId,
        CommunityId: community.id
    }).then((favourite) => {
        res.json({message: 'Successfully favourited the community'});
    }).catch((err) => {
        res.status(500).json({error: 'Failed to favourite the community'});
    })
});

/**
 * Deletes community favourite
 */
router.delete('/:name/favourite', auth.isAuthenticated, async (req, res) => {
    // get community
    const name = req.params.name;

    const community = await models.Community.findOne({
        where: models.sequelize.where(models.sequelize.fn('lower', models.sequelize.col('name')), name.toLowerCase())
    });

    if (!community) {
        return res.status(400).json({error: 'Failed to find the community'});
    }

    models.Favourite.destroy({
        where: {
            UserId: req.session.userId,
            CommunityId: community.id
        },
        individualHooks: true
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

/**
 * Checks if community url is taken
 */
router.get('/:name/exists', (req, res) => {
    
});

module.exports = router;
