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
    const communityName = req.body.communityName || '';

    const community = await models.Community.findOne({
        where: models.sequelize.where(models.sequelize.fn('lower', models.sequelize.col('name')), 
            communityName.toLowerCase())
    });

    if (!community) {
        return res.status(400).json({error: 'Failed to find the community'});
    }

    try {
        const meme = await models.Meme.create({
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
        });


        // The user votes for this meme automatically
        await models.MemeVote.create({
            diff: 1,
            MemeId: meme.id,
            UserId: req.session.userId
        });

        // fetch new details for the meme
        await meme.reload();

        res.json(meme);
    } catch(err) {
        console.error(err);
        const msg = (err && err.errors && err.errors[0] && err.errors[0].message) || 'Failed to create meme';
        res.status(400).json({error: msg});
    }
});

/**
 * Gets lists of memes
 */
router.get('/', async (req, res) => {
    const sort = (['top', 'new', 'hot'].includes(req.query.sort) && req.query.sort) || 'hot';
    const count = (0 < parseInt(req.query.count) && parseInt(req.query.count) < 100) ? parseInt(req.query.count) : 10;
    const offset = parseInt(req.query.offset) || 0;

    const result = await utils.getMemes(req, sort, count, offset);

    res.json({
        memes: result.memes,
        totalCount: result.totalCount,
        offset,
        sort,
        size: result.memes.length,
    });
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
        const myVote = await models.MemeVote.findOne({
            where: {
                MemeId: memeId,
                UserId: req.session.userId
            },
            attributes: ['diff']
        });

        const m = meme.toJSON();
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
            res.status(400).json({error: 'You have already voted for this meme'});
            return;
        }

        await vote.update({
            diff: userVote
        }).then(() => {
            res.json(vote);
        }).catch((err) => {
            console.error(err);
            const msg = (err && err.errors && err.errors[0] && err.errors[0].message) || 'Failed to update vote';
            res.status(400).json({error: msg});
        });
    }
    else {
        models.MemeVote.create({
            diff: userVote,
            MemeId: memeId,
            UserId: req.session.userId
        }).then((newVote) => {
            res.json(newVote);
        }).catch((err) => {
            const msg = (err && err.errors && err.errors[0] && err.errors[0].message) || 'Failed to create a vote for this meme';
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
 * Gets list of comments for a meme
 */
router.get('/:memeid/comments', async (req, res) => {

    let order = ['createdAt', 'ASC'];

    const comments = await models.Comment.findAll({
        where: {
            memeId: req.params.memeid
        },
        attributes: ['id', 'text'],
        order: [order]
    });

    res.json({
        comments
    });
});

/**
 * Add a comment to a meme
 */
router.post('/:memeid/comments', auth.isAuthenticated, async (req, res) => {
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
        text: req.body.text,
        UserId: req.session.userId,
        MemeId: memeId,
    }).then((comment) => {
        res.json(comment);
    }).catch((err) => {
        console.error(err);
        const msg = (err && err.errors && err.errors[0] && err.errors[0].message) || 'Failed to post comment';
        res.status(400).json({error: msg});
    });

});

/**
 * Delete a comment from a meme
 */
router.delete('/:memeid/comments/:commentid', auth.isAuthenticated, async (req, res) => {
    const memeId = req.params.memeid;

    const meme = await models.Meme.findOne({
        where: {
            id: memeId
        }
    });

    if (!meme) {
        return res.status(400).json({error: 'Failed to find this meme'});
    }

    const comment = await models.Comment.findOne({
        where: {
            MemeId: memeId,
            UserId: req.session.userId,
            id: req.params.commentid,
        }
    });

    if (!comment) {
        return res.status(400).json({error: 'Failed to find comment'});
    }

    await comment.destroy();

    res.json({message: 'Comment deleted'})
});

module.exports = router;