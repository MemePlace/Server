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

        // Hooks to update the Community table favourites amount
        Favourite.afterCreate((favourite, options) => models.Community
            .update({
                favourites: sequelize.literal('favourites + 1')
            }, {
                where: {
                    id: favourite.CommunityId
                }
            })
        );

        Favourite.afterDestroy((favourite, options) => models.Community
            .update({
                favourites: sequelize.literal('favourites - 1')
            }, {
                where: {
                    id: favourite.CommunityId
                }
            })
        );
    };

    return Favourite;
};
