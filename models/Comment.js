module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define('Comment', {
        text: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                len: {
                    args: [1, 10000],
                    msg: 'The comment text length must be between 1 and 10000 characters'
                }
            }
        }
    });

    Comment.associate = function(models) {
        models.Comment.belongsTo(models.User);
        models.Comment.belongsTo(models.Meme);
        models.Comment.belongsTo(models.Comment, {as: 'parent'}); // Comments can optionally reply to parent comments
    };

    return Comment;
};
