'use strict';
module.exports = (sequelize, DataTypes) => {
  const List = sequelize.define('List', {
    title: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    includeWord: DataTypes.STRING,
    excludeWord: DataTypes.STRING,
    smart: DataTypes.BOOLEAN
  }, {});
  List.associate = function(models) {
    // associations can be defined here
  };
  return List;
};