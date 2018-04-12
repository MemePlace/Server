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
        // associations
        models.MemeVote.belongsTo(models.Meme);
        models.MemeVote.belongsTo(models.User);


        MemeVote.beforeUpdate( (memeVote, options) => {
            if (memeVote.diff === 1){
                models.Meme.update({
                    netVote: sequelize.literal('netVote + 1')
                }, {
                    where: {
                        id: memeVote.MemeId
                    }
                })
            }else {
                models.Meme.update({
                    netVote: sequelize.literal('netVote - 1')
                }, {
                    where: {
                        id: memeVote.MemeId
                    }
                })
            }
        });

        MemeVote.afterCreate( (memeVote, options) => {
            if (memeVote.diff === 1){
                models.Meme.update({
                    netVote: sequelize.literal('netVote + 1')
                }, {
                    where: {
                        id: memeVote.MemeId
                    }
                })
            }else {
                models.Meme.update({
                    netVote: sequelize.literal('netVote - 1')
                }, {
                    where: {
                        id: memeVote.MemeId
                    }
                })
            }
        });

        MemeVote.beforeDestroy( (memeVote, options) => {
            if (memeVote.diff === 1){
                models.Meme.update({
                    netVote: sequelize.literal('netVote - 1')
                }, {
                    where: {
                        id: memeVote.MemeId
                    }
                })
            }else {
                models.Meme.update({
                    netVote: sequelize.literal('netVote + 1')
                }, {
                    where: {
                        id: memeVote.MemeId
                    }
                })
            }
        });
    };

    return MemeVote;
};
