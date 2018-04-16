module.exports = (sequelize, DataTypes) => {
    const Meme = sequelize.define('Meme', {
        title: DataTypes.STRING,
        totalVote: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        hotScore: {
            type: DataTypes.FLOAT,
            defaultValue: 0
        }
    }, {
        indexes: [
            // Link
        ],
        defaultScope: {
            attributes: {
                exclude: ['updatedAt', 'CommunityId', 'creatorId', 'hotScore']
            }
        }
    });

    Meme.associate = function(models) {
        models.Meme.belongsTo(models.User, {as: 'creator'});
        models.Meme.belongsTo(models.Template);
        models.Meme.belongsTo(models.Community);
        models.Meme.belongsTo(models.Image);
        models.Meme.hasMany(models.MemeVote);
    };

    return Meme;
};
