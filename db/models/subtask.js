'use strict';
module.exports = (sequelize, DataTypes) => {
  const Subtask = sequelize.define('Subtask', {
    content: DataTypes.STRING,
    taskId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {});
  Subtask.associate = function(models) {
    // associations can be defined here
  };
  return Subtask;
};