module.exports = (sequelize, DataTypes) => {
    const Meme = sequelize.define('Meme', {
        title: DataTypes.STRING,
        link: {
            type: DataTypes.STRING,
            validate: {
                isUrl: {
                    msg: 'Your URL doesn\'t look correct'
                }
            }
        }
    });

    Meme.associate = function(models) {
        models.Meme.belongsTo(models.User);
        models.Meme.belongsTo(models.Template);
        models.Meme.belongsTo(models.Community);
    };

    return Meme;
};
