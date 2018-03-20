module.exports = (sequelize, DataTypes) => {
    const Community = sequelize.define('Community', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            default: '',
            validate: {
                notEmpty: {
                    msg: 'The community name must be filled in'
                },
                isAlphanumeric: {
                    msg: 'The community name must be alphanumeric without spaces'
                },
                len: {
                    args: [1, 25],
                    msg: 'The community name must be between 1 and 25 characters'
                },
                isUnique: function(name, done) {
                    // Used to improve the error message as a pre validation step instead of an index error
                    Community.findOne({
                        where: sequelize.where(sequelize.fn('lower', sequelize.col('name')), name.toLowerCase()),
                    }).then((name) => {
                        if (!name) {
                            done();
                        }
                        else {
                            done(new Error('That community name is already in use'));
                        }
                    }).catch((err) => {
                        done(err);
                    });
                }
            }
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            default: '',
            validate: {
                notEmpty: {
                    msg: 'The community title must be filled in'
                },
                len: {
                    args: [1, 100],
                    msg: 'The title must be between 1 and 100 characters'
                }
            }
        },
        description: DataTypes.TEXT,
        sidebar: DataTypes.TEXT,
        nsfw: DataTypes.BOOLEAN
    }, {
        indexes: [
            {
                name: 'unique_insensitive_name',
                unique: true,
                fields: [sequelize.fn('lower', sequelize.col('name'))]
            }
        ]
    });

    Community.associate = function(models) {
        models.Community.belongsTo(models.User, {as: 'creator'});
        models.Community.hasMany(models.Favourite);
    };

    return Community;
};
