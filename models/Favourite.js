module.exports = (sequelize, DataTypes) => {
    const Favourite = sequelize.define('Favourite', {}, {
        indexes: [
            {
                unique: true,
                fields: ['CommunityId', 'UserId']
            }
        ]
    });

    Favourite.associate = function(models) {
        models.Favourite.belongsTo(models.User);
        models.Favourite.belongsTo(models.Community);
    };

    return Favourite;
};
