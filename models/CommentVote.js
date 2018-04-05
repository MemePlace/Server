module.exports = (sequelize, DataTypes) => {
    const CommentVote = sequelize.define('CommentVote', {
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

    CommentVote.associate = function(models) {
        // associations
        models.CommentVote.belongsTo(models.Comment);
        models.CommentVote.belongsTo(models.User);
    };

    return CommentVote;
};
