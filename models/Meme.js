module.exports = (sequelize, DataTypes) => {
    const Meme = sequelize.define('Meme', {
        title: DataTypes.STRING,
    }, {
        indexes: [
            // Link
        ],
        defaultScope: {
            attributes: {
                exclude: ['updatedAt', 'CommunityId', 'creatorId']
            }
        }
    });

    Meme.associate = function(models) {
        models.Meme.belongsTo(models.User, {as: 'creator'});
        models.Meme.belongsTo(models.Template);
        models.Meme.belongsTo(models.Community);
        models.Meme.belongsTo(models.Image);
    };

    return Meme;
};
