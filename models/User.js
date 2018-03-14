module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        username: DataTypes.STRING,
        password: DataTypes.STRING,
        email: DataTypes.STRING
    });

    User.associate = function(models) {
        // Add model associations
        models.User.belongsToMany(models.Community, {as: 'Favourites', through: 'CommunityFavourites'});
        models.User.belongsToMany(models.Meme, {through: 'Votes'});
    };

    return User;
};
