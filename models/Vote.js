module.exports = (sequelize, DataTypes) => {
    const Vote = sequelize.define('Vote', {
        title: DataTypes.STRING,
        link: DataTypes.STRING
    });

    Vote.associate = function(models) {
        models.Vote.belongsTo(models.User);
    };

    return Vote;
};
