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
            attributes: {
                exclude: [
                    'updatedAt',
                    'creatorId',
                    'serialized'
                ]
            },
            order: [['createdAt', 'DESC']],
            include: [{
                model: models.User,
                as: 'creator',
                attributes: ['username']
            }],
        });
    }
    else if (sort === 'top') {
        options = Object.assign(options, {
            attributes: {
                include: [
                    [models.sequelize.fn('COUNT', models.sequelize.col('Memes.id')), 'memeCount'],
                ],
                exclude: [
                    'updatedAt',
                    'creatorId',
                    'serialized'
                ]
            },
            include: [{
                model: models.User,
                as: 'creator',
                attributes: ['username']
            }, {
                attributes: [],
                model: models.Meme,
            }],
            group: ['Template.id'],
            order: models.sequelize.literal('memeCount DESC'),
        });
    }
    else {
        throw new Error("Improper sort parameter given");
    }

    const result = await models.Template.findAndCountAll(options);

    return {
        totalCount: result.count,
        templates: result.rows
    };
};
