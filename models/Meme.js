module.exports = (sequelize, DataTypes) => {
    const Meme = sequelize.define('Meme', {
        title: DataTypes.STRING,
        link: DataTypes.STRING
    });

    Meme.associate = function(models) {
        models.Meme.belongsTo(models.User);
        models.Meme.hasMany(models.Vote);
        models.Meme.belongsTo(models.Template);
    };

    return Meme;
};
