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
            'previewLink',
            'createdAt',
        ],
        limit: count,
        offset
    };

    if (communityId) {
        options = Object.assign(options, {
            where: {
                CommunityId: communityId
            },
        });
    }

    if (sort === 'new') {
        options = Object.assign(options, {
            include: [{
                model: models.User,
                as: 'creator',
                attributes: ['username']
            }],
            order: [['createdAt', 'DESC']]
        });
    }
    else if (sort === 'top') {
        options = Object.assign(options, {
            include: [{
                model: models.User,
                as: 'creator',
                attributes: ['username'],
            }, {
                attributes: [],
                model: models.Meme,
            }],
            group: ['Template.id'],
            order: [[models.sequelize.fn('COUNT', models.sequelize.col('Memes.id')), 'DESC']],
            subQuery: false, // We want the limit to apply to the outer query
        });
    }
    else {
        throw new Error("Improper sort parameter given");
    }

    const result = await models.Template.findAndCountAll(options);

    return {
        totalCount: result.count.length,
        templates: result.rows
    };
};
