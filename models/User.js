module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                is: ['^[a-z0-9_-]+$', 'i'], // Alphanumeric, _, -
                len: [1, 25]
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true
            }
        }
    });

    User.associate = function(models) {
        // Add model associations
        models.User.belongsToMany(models.Community, {as: 'Favourites', through: 'CommunityFavourites'});
        models.User.belongsToMany(models.Meme, {through: 'MemeVotes'});
        models.User.belongsToMany(models.Comment, {through: 'CommentVotes'});
    };

    return User;
};
