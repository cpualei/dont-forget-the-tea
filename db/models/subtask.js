'use strict';
module.exports = (sequelize, DataTypes) => {
  const Subtask = sequelize.define('Subtask', {
    content: DataTypes.STRING,
    taskId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {});
  Subtask.associate = function(models) {
    Subtask.belongsTo(models.Task, { foreignKey: 'taskId'});
    Subtask.belongsTo(models.User, { foreignKey: 'userId'});
  };
  return Subtask;
};