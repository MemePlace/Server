module.exports = (sequelize, DataTypes) => {
    const Community = sequelize.define('Community', {
        name: DataTypes.STRING,
        description: DataTypes.STRING,
        nsfw: DataTypes.BOOLEAN
    });

    Community.associate = function(models) {
        models.Community.belongsTo(models.User, {as: 'creator'});
    };

    return Community;
};
