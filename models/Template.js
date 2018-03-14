module.exports = (sequelize, DataTypes) => {
    const Template = sequelize.define('Template', {
        title: DataTypes.STRING,
        link: DataTypes.STRING,
        state: DataTypes.JSON,
    });

    Template.associate = function(models) {
        models.Template.belongsTo(models.User, {as: 'author'});
    };

    return Template;
};
