module.exports = (sequelize, DataTypes) => {
    const Template = sequelize.define('Template', {
        title: {
            type: DataTypes.STRING,
            validate: {
                len: {
                    args: [1, 100],
                    msg: 'Your title must be between 1 and 100 characters'
                }
            }
        },
        serialized: {
            type: DataTypes.JSON,
            allowNull: false,
            default: '',
            validate: {
                notEmpty: {
                    msg: 'You must fill in the serialized template state'
                }
            }
        },
    });

    Template.associate = function(models) {
        models.Template.belongsTo(models.User, {as: 'creator'});
        models.Template.hasMany(models.Meme);
        models.Template.belongsTo(models.Image);
    };

    return Template;
};
