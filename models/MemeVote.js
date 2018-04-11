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


        MemeVote.afterUpdate( (memeVote, options) => {
            console.log("Inside MemeVote update");

            const newNetVote = models.MemeVote.sum('diff', {
                where: {
                    MemeId: memeVote.MemeId
                }
            });

            console.log("New net vote = " + newNetVote.toString());

            models.Meme.update({
                netVote: newNetVote
            }, {
                where: {
                    id: memeVote.MemeId
                }
            });

            console.log("new vote = " );
        });
    };

    return MemeVote;
};
