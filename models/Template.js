module.exports = (sequelize, DataTypes) => {
    const Template = sequelize.define('Template', {
        title: {
            type: DataTypes.STRING,
            validate: {
                len: [1, 100]
            }
        },
        previewLink: {
            type: DataTypes.STRING,
            validate: {
                isUrl: true
            }
        },
        serialized: {
            type: DataTypes.JSON,
            allowNull: false
        },
    });

    Template.associate = function(models) {
        models.Template.belongsTo(models.User, {as: 'author'});
    };

    return Template;
};
