const models = require('./models');

exports.getPrivateUserDetails = function(username) {
    const user =  models.User.find({
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
