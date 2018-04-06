const express = require('express');
const models = require('../models');
const auth = require('../auth');
const utils = require('../utils');
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
 * Deletes template
 */
router.delete('/:id', auth.isAuthenticated, async (req, res) => {
    const id = req.params.id;

    const template = await models.Template.findOne({
        where: {
            id
        }
    });

    if (template.creatorId !== req.session.userId) {
        res.status(401).json({error: 'You must be the creator of this template to delete it'});
        return;
    }

    // Check if there is a meme that uses this template
    const meme = await models.Meme.findOne({
        where: {
            TemplateId: id
        }
    });

    if (meme) {
        res.status(400).json({error: 'You cannot delete a template if a meme is using it'});
        return;
    }

    await template.destroy();

    res.json({message: 'Successfully deleted the template'});
});

/**
 * Gets lists of templates
 */
router.get('/', async (req, res) => {
    const sort = (['top', 'new'].includes(req.query.sort) && req.query.sort) || 'top';
    const count = (0 < parseInt(req.query.count) && parseInt(req.query.count) < 100) ? parseInt(req.query.count) : 10;
    const offset = parseInt(req.query.offset) || 0;

    const result = await utils.getTemplates(sort, count, offset);

    res.json({
        templates: result.templates,
        totalCount: result.totalCount,
        offset,
        size: result.templates.length,
        sort
    });
});

/**
 * Retrieves template details
 */
router.get('/:id', async (req, res) => {
    const id = req.params.id;

    const template = await models.Template.findOne({
        attributes: {
            exclude: [
                'updatedAt',
                'creatorId'
            ]
        },
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

    res.status(500).json({error: 'Method not implemented'});
});

module.exports = router;
