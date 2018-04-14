module.exports = (sequelize, DataTypes) => {
    const Meme = sequelize.define('Meme', {
        title: DataTypes.STRING,
        link: {
            type: DataTypes.STRING,
            allowNull: false,
            default: '',
            validate: {
                notEmpty: {
                    msg: 'The meme must have an URL'
                },
                isUrl: {
                    msg: 'Your URL doesn\'t have a proper structure'
                },
                isUnique: function(link, done){
                    Meme.findOne({
                        where: sequelize.where(sequelize.fn('lower', sequelize.col('link')), link.toLowerCase()),
                    }).then((link) => {
                        if (!link) {
                            done();
                        }else{
                            done(new Error('That meme url already exist'));
                        }
                    }).catch((err) => {
                        done(err);
                    });
                }
            }
        },
        totalVote: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    }, {
        indexes: [
            // Link
        ],
        defaultScope: {
            attributes: {
                exclude: ['updatedAt', 'CommunityId', 'creatorId']
            }
        }
    });

    Meme.associate = function(models) {
        models.Meme.belongsTo(models.User, {as: 'creator'});
        models.Meme.belongsTo(models.Template);
        models.Meme.belongsTo(models.Community);
        models.Meme.belongsTo(models.Image);
    };

    return Meme;
};
