const express = require('express');
const models = require('../models');
const router = express.Router();
const Op = models.Sequelize.Op;

/**
 * Returns search query autocomplete results
 */
router.get('/:query/autocomplete', async (req, res) => {
    const query = req.params.query;
    let typeCount = parseInt(req.query.typeCount);
    typeCount = (0 < typeCount && typeCount <= 10 && typeCount) || 4;

    const response = {};

    // TODO: Use a real searching library

    // Fetch users corresponding to the query
    const users = await models.User.findAll({
        attributes: ['username'],
        where: {
            username: {
                like: `%${query}%`
            }
        },
        limit: typeCount
    });

    response.users = users;

    // Fetch communities corresponding to the query
    const communities = await models.Community.findAll({
        attributes: ['name', 'title', 'favourites', 'nsfw'],
        where: {
            [Op.or]: [
                {name: {like: `%${query}%`}},
                {title: {like: `%${query}%`}},
                {description: {like: `%${query}%`}}
            ]
        },
        order: [['favourites', 'DESC']],
        limit: typeCount
    });

    response.communities = communities;

    // TODO: Add Meme searching

    res.json(response);
});

module.exports = router;
