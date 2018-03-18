const models = require('./models');

exports.getPrivateUserDetails = function(username) {
    return models.User.find({
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
};
