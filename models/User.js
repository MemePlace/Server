module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                is: ['^[a-z0-9_-]+$', 'i'], // Alphanumeric, _, -
                len: [1, 25]
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isEmail: true
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
