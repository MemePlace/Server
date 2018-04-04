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
        TemplateId: parseInt(req.body.templateId) || null,
        // if user must post to community, then before they've joined any community, what do they post to?
        CommunityId: parseInt(req.body.communityId) || null,
   }).then((meme) => {
       res.json(meme);                      // unsure about this... what happens if the meme is created?
   }).catch((err) => {
       console.error(err);
       const msg = (err && err.errors && err.errors[0] && err.errors[0].message) || 'Failed to create meme';
       res.status(400).json({error: msg});
   });
});

/**
 * Gets lists of memes
 */
router.get('/', async (req, res) => {
    // const sort = (['top', 'host', 'new'].includes(req.query.sort) && req.query.sort) || 'top';
    // const count = (0 < parseInt(req.query.count) && parseInt(req.query.count) < 100) ? parseInt(req.query.count) : 10;
    // // what is offset?
    // const offset = parseInt(req.query.offset) || 0;
    //
    // // never defined an order??
    // let order;
    //
    // if (sort === 'top') {
    //     //order = ['voteCount', 'DESC']
    // }
    // else if (sort === 'new') {
    //     // how are we storing creation time?
    //     //order = ['createdAt', 'DESC'];
    // }
    // else if (sort === 'host'){
    //     // get memes created by this user only
    //     // not sure how to specify order...
    // }
    //
    // // why do we need this total count?
    // const totalCount = await models.Meme.count();
    //
    // const memes = await models.Meme.findAll({
    //     limit: count,
    //     offset,
    //     order: [order]
    // });
    //
    // res.json({
    //     memes,
    //     totalCount,
    //     offset,
    //     size: memes.length,
    //     sort
    // });
});

/**
 * Retrieves meme details
 */
router.get('/:memeid', async (req, res) => {
    const memeId = req.params.memeid;

    const meme = await models.Meme.findOne({
        where: {
            id: memeId
        },
        include: [{
            model: models.User,
            as: 'creator',
            attributes: ['username']
        }, {
            model: models.Community,
            attributes: ['name']
        }],
    });

    if (meme) {
        res.json(meme);
    } else {
        res.status(400).json({error: 'Failed to find meme'});
    }
});

/**
 * Deletes meme
 */
router.delete('/:memeid', auth.isAuthenticated, async (req, res) => {
    const memeId = req.params.memeid;

    const meme = await models.Meme.findOne({
        where: {
            id: memeId,
            creatorId: req.session.userId
        }
    });

    if (!meme) {
        return res.status(400).json({error: 'Failed to find this meme under current creator\'s name'});
    }

    models.Meme.destroy({
        where: {
            id: memeId,
            creatorId: req.session.userId
        }
    }).then(() => {
        res.json({message: 'Successfully deleted the meme'});
    }).catch((err) => {
        res.status(500).json({error: 'Failed to delete the meme'});
    })
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

module.exports = router;