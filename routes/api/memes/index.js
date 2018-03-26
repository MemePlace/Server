const express = require('express');
const bcrypt = require('bcrypt');
const models = require('../models');
const auth = require('../auth');
const router = express.Router();

/**
 * Creates meme
 */
router.post('/', auth.isAuthenticated, (req, res) => {
   models.Meme.create({
        title: req.body.title,
        link: req.body.link,
        creatorId: req.session.userId,
        templateId: req.body.templateId,
        // if user must post to community, then before they've joined any community, what do they post to?
        communityId: req.body.communityId,
   }).then((meme) => {
       res.json(meme);                      // unsure about this... what happens if the meme is created?
   }).catch((err) => {
       const msg = (err && err.errors && err.errors[0] && err.errors[0].message) || 'Failed to create meme';
       res.status(400).json({error: msg});
   });
});

/**
 * Gets lists of memes
 */
router.get('/', async (req, res) => {
    const sort = (['top', 'host', 'new'].includes(req.query.sort) && req.query.sort) || 'top';
    const count = (0 < parseInt(req.query.count) && parseInt(req.query.count) < 100) ? parseInt(req.query.count) : 10;
    // what is offset?
    const offset = parseInt(req.query.offset) || 0;

    // never defined an order??
    let order;

    if (sort === 'top') {
        //order = ['voteCount', 'DESC']
    }
    else if (sort === 'new') {
        // how are we storing creation time?
        //order = ['createdAt', 'DESC'];
    }
    else if (sort === 'host'){
        // get memes created by this user only
        // not sure how to specify order...
    }

    // why do we need this total count?
    const totalCount = await models.Meme.count();

    const memes = await models.Meme.findAll({
        limit: count,
        offset,
        order: [order]
    });


    res.json({
        memes,
        totalCount,
        offset,
        size: memes.length,
        sort
    });
});

/**
 * Retrieves meme details
 */
router.get('/:memeid', async (req, res) => {

});


/**
 * Deletes meme
 */
router.delete('/:memeid', auth.isAuthenticated, async (req, res) => {

});

/**
 * Vote for the meme
 */
router.put('/:memeid/vote', auth.isAuthenticated, async (req, res) => {

});

/**
 * Deletes meme
 */
router.delete('/:memeid/vote', auth.isAuthenticated, async (req, res) => {

});