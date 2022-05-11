'use strict';
module.exports = (sequelize, DataTypes) => {
  const ListTask = sequelize.define('ListTask', {
    taskId: DataTypes.INTEGER,
    listId: DataTypes.INTEGER
  }, {});
  ListTask.associate = function(models) {
    ListTask.belongsTo(models.List, { foreignKey: 'listId'});
    ListTask.belongsTo(models.Task, { foreignKey: 'taskId'});
  };
  return ListTask;
};