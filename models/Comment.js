module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define('Comment', {
        text: DataTypes.TEXT
    });

    Comment.associate = function(models) {
        models.Comment.belongsTo(models.User);
        models.Comment.belongsTo(models.Meme);
        models.Comment.belongsTo(models.Comment, {as: 'parent'});
    };

    return Comment;
};
