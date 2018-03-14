module.exports = (sequelize, DataTypes) => {
    const Vote = sequelize.define('Vote');

    Vote.associate = function(models) {
        models.Vote.belongsTo(models.User);
    };

    return Vote;
};
