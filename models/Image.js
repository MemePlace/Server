module.exports = (sequelize, DataTypes) => {
    const Image = sequelize.define('Image', {
        link: {
            type: DataTypes.STRING,
            allowNull: false,
            default: '',
            validate: {
                notEmpty: {
                    msg: 'You must include an image URL'
                },
                isUrl: {
                    msg: 'Your URL doesn\'t have a proper structure'
                }
            }
        },
        width: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: {
                    args: true,
                    msg: 'You must include an image width'
                },
                min: {
                    args: 100,
                    msg: 'Your image width must be greater than 100 pixels'
                },
                max: {
                    args: 6000,
                    msg: 'Your image width cannot be greater than 6000 pixels'
                }
            }
        },
        height: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: {
                    args: true,
                    msg: 'You must include an image height'
                },
                min: {
                    args: 100,
                    msg: 'Your image height must be greater than 100 pixels'
                },
                max: {
                    args: 6000,
                    msg: 'Your image height cannot be greater than 6000 pixels'
                }
            }
        }
    }, {
        indexes: [
            // Indexes
        ]
    });

    Image.associate = function(models) {
        // Associations
    };

    return Image;
};
