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
    }, {
        indexes: [
            {
                name: 'unique_insensitive_name',
                unique: true,
                fields: [sequelize.fn('lower', sequelize.col('name'))]
            }
        ]
    });

    Community.associate = function(models) {
        models.Community.belongsTo(models.User, {as: 'creator'});
        models.Community.hasMany(models.Favourite);
    };

    return Community;
};
