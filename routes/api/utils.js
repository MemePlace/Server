const models = require('./models');

exports.getPrivateUserDetails = async function(username) {
    const user = await models.User.find({
        attributes: ['username'],
        where: {
            username: username
        },
        include: [{
            model: models.Favourite,
            include: [{
                model: models.Community,
                attributes: ['name', 'title']
            }],
            attributes: ['CommunityId']
        }]
    });

    if (user) {
        user.dataValues.Favourites = user.dataValues.Favourites.map((favourite) => favourite.Community);
    }

    return user;
};

exports.getTemplates = async function(sort, count, offset, communityId) {
    let options = {
        attributes: [
            'title',
            'createdAt',
        ],
        include: [{
            model: models.User,
            as: 'creator',
            attributes: ['username'],
        }, {
            model: models.Image,
        }],
        limit: count,
        offset,
        subQuery: false, // We want the limit to apply to the outer query
    };

    if (sort === 'new') {
        options = Object.assign(options, {
            order: [['createdAt', 'DESC']]
        });
    }
    else if (sort === 'top') {
        options = Object.assign(options, {
            group: ['Template.id'],
            order: [[models.sequelize.fn('COUNT', models.sequelize.col('Memes.id')), 'DESC']]
        });
    }
    else {
        throw new Error("Improper sort parameter given");
    }

    const memeInclude = {
        attributes: [],
        model: models.Meme,
    };

    // For communities, require that there are memes and that the meme communities are explicit
    if (communityId) {
        memeInclude.required = true;
        memeInclude.where = {
            CommunityId: communityId
        };
    }

    options.include.push(memeInclude);

    const result = await models.Template.findAndCountAll(options);

    return {
        totalCount: result.count.length,
        templates: result.rows
    };
};

exports.getMemes = async function(sort, count, offset, communityId) {
    let order;

    if (sort === 'top') {
        order = ['totalVote', 'DESC'];
    }
    else if (sort === 'new') {
        order = ['createdAt', 'DESC']
    }
    else if (sort === 'hot') {
        order = ['hotScore', 'DESC']
    }
    else {
        throw new Error('Improper sort parameter given');
    }

    const options = {
        limit: count,
        offset,
        order: [order],
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
    };

    if (communityId) {
        options.where = {
            CommunityId: communityId
        };
    }

    const result = await models.Meme.findAndCountAll(options);

    return {
        totalCount: result.count,
        memes: result.rows,
    };
};
