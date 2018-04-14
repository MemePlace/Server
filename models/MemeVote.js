const utils = require('../utils');

module.exports = (sequelize, DataTypes) => {
    const MemeVote = sequelize.define('MemeVote', {
        diff: {
            type: DataTypes.TINYINT,
            validate: {
                isIn: {
                    args: [[-1, 1]],
                    msg: 'Your vote must be either -1 or 1'
                }
            }
        }
    });

    MemeVote.associate = function(models) {
        async function updateScore(difference, memeId) {
            const meme = await models.Meme.findOne({where: {id: memeId}});

            if (!meme) {
                return;
            }
            
            const newTotalScore = meme.totalVote + difference;
            const newHotScore = utils.hotScore(newTotalScore, meme.createdAt);

            await meme.update({
                totalVote: sequelize.literal(`totalVote ${difference >= 0 ? '+': ''} ${difference}`),
                hotScore: newHotScore
            });
        }

        // associations
        models.MemeVote.belongsTo(models.Meme);
        models.MemeVote.belongsTo(models.User);

        MemeVote.beforeUpdate(async (memeVote) => updateScore((memeVote.diff === 1) ? 2 : -2, memeVote.MemeId));


        MemeVote.afterCreate(async (memeVote) => updateScore((memeVote.diff === 1) ? 1 : -1, memeVote.MemeId));

        MemeVote.beforeDestroy(async (memeVote) => updateScore((memeVote.diff === 1) ? -1 : 1, memeVote.MemeId));
    };

    return MemeVote;
};
