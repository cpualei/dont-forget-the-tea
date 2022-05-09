'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    username: DataTypes.STRING,
    profilePicURL: DataTypes.STRING,
    email: DataTypes.STRING,
    hashPassword: DataTypes.STRING
  }, {});
  User.associate = function(models) {

    User.hasMany(models.Task, { foreignKey: 'userId' });
    User.hasMany(models.Subtask, { foreignKey: 'userId' });
    User.hasMany(models.List, { foreignKey: 'userId' });
  };
  return User;
};
