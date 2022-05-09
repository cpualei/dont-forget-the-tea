'use strict';
module.exports = (sequelize, DataTypes) => {
  const ListTask = sequelize.define('ListTask', {
    taskId: DataTypes.INTEGER,
    listId: DataTypes.INTEGER
  }, {});
  ListTask.associate = function(models) {
    // associations can be defined here
  };
  return ListTask;
};