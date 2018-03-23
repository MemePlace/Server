const express = require('express');
const models = require('../models');
const router = express.Router();
const Op = models.Sequelize.Op;

/**
 * Returns search query results
 */
router.get('/:query', async (req, res) => {
    const query = req.params.query;
    const response = {};

    // TODO: Use a real searching library

    // Fetch users corresponding to the query
    const users = await models.User.findAll({
        attributes: ['username'],
        where: {
            username: {
                like: `%${query}%`
            }
        }
    });

    response.users = users;

    // Fetch communities corresponding to the query
    const communities = await models.Community.findAll({
        attributes: ['name', 'title', 'favourites', 'description', 'nsfw'],
        where: {
            [Op.or]: [
                {name: {like: `%${query}%`}},
                {title: {like: `%${query}%`}},
                {description: {like: `%${query}%`}}
            ]
        },
        order: [['favourites', 'DESC']]
    });

    response.communities = communities;

    // TODO: Add Meme searching

    res.json(response);
});

module.exports = router;
