const express = require('express');
const models = require('../models');
const router = express.Router();
const Op = models.Sequelize.Op;

/**
 * Returns search query autocomplete results
 */
router.get('/:query/autocomplete', async (req, res) => {
    const query = req.params.query;
    let countPerType = parseInt(req.query.countPerType);
    countPerType = (0 < countPerType && countPerType <= 10 && countPerType) || 4;

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
        limit: countPerType
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
        limit: countPerType
    });

    response.communities = communities;

    // TODO: Add Meme searching

    res.json(response);
});

module.exports = router;
