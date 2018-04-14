const express = require('express');
const bcrypt = require('bcrypt');
const models = require('../models');
const auth = require('../auth');
const utils = require('../utils');
const router = express.Router();

/**
 * Creates meme
 */
router.post('/', auth.isAuthenticated, async (req, res) => {
    const communityName = req.body.communityName;

    const community = await models.Community.findOne({
        where: models.sequelize.where(models.sequelize.fn('lower', models.sequelize.col('name')), 
            communityName.toLowerCase())
    });

    if (!community) {
        return res.status(400).json({error: 'Failed to find the community'});
    }

   models.Meme.create({
        title: req.body.title,
        creatorId: req.session.userId,
        Image: {
            link: req.body.link,
            width: req.body.width,
            height: req.body.height
        },
        TemplateId: parseInt(req.body.templateId) || null,
        CommunityId: community.id,
   }, {
       include: [models.Image]
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
    const sort = (['top', 'new'].includes(req.query.sort) && req.query.sort) || 'top';
    const count = (0 < parseInt(req.query.count) && parseInt(req.query.count) < 100) ? parseInt(req.query.count) : 10;
    const offset = parseInt(req.query.offset) || 0;

    const result = await utils.getMemes(sort, count, offset);

    res.json({
        memes: result.memes,
        totalCount: result.totalCount,
        offset,
        size: result.memes.length,
        sort
    })
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
        }, {
            model: models.Image
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

/**
 * Add a comment to a meme
 */
router.put('/:memeid/comment', auth.isAuthenticated, async (req, res) => {
    const memeId = req.params.memeid;

    const meme = await models.Meme.findOne({
        where: {
            id: memeId
        }
    });

    if (!meme) {
        return res.status(400).json({error: 'Failed to find this meme'});
    }

    models.Comment.create({
        // title: req.body.title,
        // creatorId: req.session.userId,
        // Image: {
        //     link: req.body.link,
        //     width: req.body.width,
        //     height: req.body.height
        // },
        // TemplateId: parseInt(req.body.templateId) || null,
        // CommunityId: community.id,
        text: req.body.text,
    }, {
        include: [models.Image]
    }).then((meme) => {
        res.json(meme);
    }).catch((err) => {
        console.error(err);
        const msg = (err && err.errors && err.errors[0] && err.errors[0].message) || 'Failed to create meme';
        res.status(400).json({error: msg});
    });

});

module.exports = router;