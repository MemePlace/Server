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
        CommunityId: parseInt(req.body.communityId) || null,
   }).then((meme) => {
       res.json(meme);
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
        }]
    });

    if (meme) {
        const totalVote = await models.MemeVote.sum('diff', {
            where: {
                MemeId: memeId
            }
        });

        const myVote = await models.MemeVote.findOne({
            where: {
                MemeId: memeId,
                UserId: req.session.userId
            },
            attributes: ['diff']
        });

        const m = meme.toJSON();
        m.totalVote = totalVote;
        m.myVote = myVote;

        res.json(m);
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
            id: memeId
        }
    });

    if (!meme) {
        return res.status(400).json({error: 'Failed to find this meme'});
    }

    if (meme.creatorId !== req.session.userId) {
        res.status(401).json({error: 'You must be the creator of this meme to delete it'});
        return;
    }

    await meme.destroy();

    res.json({message: 'Successfully deleted the meme'});
});

/**
 * Vote for the meme
 */
router.put('/:memeid/vote', auth.isAuthenticated, async (req, res) => {
    const memeId = req.params.memeid;
    const userVote = parseInt(req.body.vote);

    const meme = await models.Meme.findOne({
        where: {
            id: memeId
        }
    });

    if (!meme) {
        return res.status(400).json({error: 'Failed to find this meme'});
    }

    const vote = await models.MemeVote.findOne({
        where: {
            MemeId: memeId,
            UserId: req.session.userId
        }
    });

    if (vote) {
        if (vote.diff === userVote) {
            res.status(401).json({error: 'You have already voted for this meme'});
            return;
        }

        vote.diff = userVote;

        await vote.save().catch((err) => {
            console.error(err);
            const msg = (err && err.errors && err.errors[0] && err.errors[0].message) || 'Failed to create meme';
            res.status(400).json({error: msg});
        });

        res.json({message: 'Updated vote status for this meme'});
    }
    else {
        models.MemeVote.create({
            diff: userVote,
            MemeId: memeId,
            UserId: req.session.userId
        }).then((newVote) => {
            res.json(newVote);
        }).catch((err) => {
            const msg = (err && err.errors && err.errors[0] && err.errors[0].message) || 'Failed to vote for this meme';
            res.status(400).json({error: msg});
        });
    }
});


/**
 * Delete vote for the meme
 */
router.delete('/:memeid/vote', auth.isAuthenticated, async (req, res) => {
    const memeId = req.params.memeid;

    const meme = await models.Meme.findOne({
        where: {
            id: memeId
        }
    });

    if (!meme) {
        return res.status(400).json({error: 'Failed to find this meme'});
    }

    // Check if user has already voted for this meme
    const vote = await models.MemeVote.findOne({
        where: {
            MemeId: memeId,
            UserId: req.session.userId
        }
    });

    if (!vote) {
        return res.status(400).json({error: 'You\'ve never voted for this meme'});
    }

    await vote.destroy();

    res.json({message: 'Vote deleted'})
});

module.exports = router;