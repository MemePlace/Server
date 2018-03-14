module.exports = (sequelize, DataTypes) => {
    const Community = sequelize.define('Community', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isAlphanumeric: true,
                len: [1, 25]
            }
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 100]
            }
        },
        description: DataTypes.TEXT,
        sidebar: DataTypes.TEXT,
        nsfw: DataTypes.BOOLEAN
    });

    Community.associate = function(models) {
        models.Community.belongsTo(models.User, {as: 'creator'});
    };

    return Community;
};
