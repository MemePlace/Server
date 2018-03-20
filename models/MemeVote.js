module.exports = (sequelize, DataTypes) => {
    const MemeVote = sequelize.define('MemeVote', {
        diff: {
            type: DataTypes.TINYINT,
            validate: {
                isIn: {
                    args: [-1, 1],
                    msg: 'Your vote must be either -1 or 1'
                }
            }
        }
    });

    MemeVote.associate = function(models) {
        // associations
        models.MemeVote.belongsTo(models.Meme);
        models.MemeVote.belongsTo(models.User);
    };

    return MemeVote;
};
