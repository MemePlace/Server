module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: '', // hack to get a custom validation message for allowNull
            validate: {
                notEmpty: {
                    msg: 'You must fill in a username'
                },
                is: {
                    args: ['^[a-z0-9_-]+$', 'i'], // Alphanumeric, _, -
                    msg: 'Your username can only contain alphanumeric characters, underscores and dashes'
                },
                len: {
                    args: [1, 25],
                    msg: 'Your username can only be between 1 and 25 characters'
                },
                isUnique: function(username, done) {
                    // Used to improve the error message as a pre validation step instead of an index error

                    User.findOne({
                        where: sequelize.where(sequelize.fn('lower', sequelize.col('username')), username.toLowerCase()),
                    }).then((user) => {
                        if (!user) {
                            done();
                        }
                        else {
                            done(new Error('That username is already in use'));
                        }
                    }).catch((err) => {
                        done(err);
                    });
                }
            }
        },
        password: {
            type: DataTypes.STRING,
            defaultValue: '',
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'You must fill in a password'
                }
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isEmail: {
                    args: true,
                    msg: 'That email doesn\'t look correct'
                },
                isUnique: function(email, done) {
                    // Used to improve the error message as a pre validation step instead of an index error
                    if (!email) done();

                    User.findOne({
                        where: sequelize.where(sequelize.fn('lower', sequelize.col('email')), email.toLowerCase()),
                    }).then((user) => {
                        if (!user) {
                            done();
                        }
                        else {
                            done(new Error('That email is already in use'));
                        }
                    }).catch((err) => {
                        done(err);
                    });
                }
            }
        }
    }, {
        indexes: [
            {
                name: 'unique_insensitive_username',
                unique: true,
                fields: [sequelize.fn('lower', sequelize.col('username'))]
            },
            {
                name: 'unique_insensitive_email',
                unique: true,
                fields: [sequelize.fn('lower', sequelize.col('email'))]
            }
        ]
    });

    User.associate = function(models) {
        // Add model associations
        models.User.hasMany(models.Favourite);
    };

    return User;
};
