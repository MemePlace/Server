const express = require('express');
const models = require('../models');
const auth = require('../auth');
const router = express.Router();

/**
 * Creates a template
 */
router.post('/', auth.isAuthenticated, (req, res) => {
    models.Template.create({
        title: req.body.title,
        previewLink: req.body.previewLink,
        serialized: req.body.serialized,
        creatorId: req.session.userId,
    }).then((template) => {
        res.json(template);
    }).catch((err) => {
        console.error(err);
        const msg = (err && err.errors && err.errors[0] && err.errors[0].message) || 'Failed to create template';
        res.status(400).json({error: msg});
    });
});

/**
 * Gets lists of templates
 */
router.get('/', async (req, res) => {
    const sort = (['top', 'new'].includes(req.query.sort) && req.query.sort) || 'top';
    const count = (0 < parseInt(req.query.count) && parseInt(req.query.count) < 100) ? parseInt(req.query.count) : 10;
    const offset = parseInt(req.query.offset) || 0;

    const totalCount = await models.Template.count();

    let templates;

    if (sort === 'new') {
        templates = await models.Template.findAll({
            limit: count,
            offset,
            order: [['createdAt', 'DESC']],
            include: [{
                model: models.User,
                as: 'creator',
                attributes: ['username']
            }],
        });
    }
    else if (sort === 'top') {
        templates = await models.Template.findAll({
            attributes: {
                include: [
                    [models.sequelize.fn('COUNT', models.sequelize.col('Memes.id')), 'memeCount'],
                ],
                exclude: [
                    'updatedAt',
                    'creatorId'
                ]
            },
            include: [{
                model: models.User,
                as: 'creator',
                attributes: ['username']
            }, {
                attributes: [],
                model: models.Meme,
                required: false,
            }],
            limit: count,
            offset,
            group: ['Template.id'],
            order: models.sequelize.literal('memeCount DESC'),
        });
    }

    res.json({
        templates,
        totalCount,
        offset,
        size: templates.length,
        sort
    });
});

/**
 * Retrieves template details
 */
router.get('/:id', async (req, res) => {
    const id = req.params.id;

    const template = await models.Template.findOne({
        where: {
            id
        },
        include: [{
            model: models.User,
            as: 'creator',
            attributes: ['username']
        }],
    });

    if (template) {
        res.json(template);
    } else {
        res.status(400).json({error: 'Failed to find the template'});
    }
});

/**
 * Retrieves memes that use this template
 */
router.get('/:id/memes', (req, res) => {
    const sort = (['top', 'new'].includes(req.query.sort) && req.query.sort) || 'top';
    const offset = parseInt(req.query.offset) || 0;
    const count = (0 < parseInt(req.query.count) && parseInt(req.query.count) < 100) ? parseInt(req.query.count) : 10;

    // TODO
});

module.exports = router;
