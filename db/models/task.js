'use strict';
module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
    content: DataTypes.STRING,
    dueDate: DataTypes.DATE,
    userId: DataTypes.INTEGER
  }, {});
  Task.associate = function(models) {
    // associations can be defined here
    Task.hasMany(models.Subtask, { foreignKey: 'taskId' });
    Task.belongsTo(models.User, { foreignKey: 'userId' });
    Task.belongsToMany(models.List, {
      through: 'ListTask',
      otherKey: 'listId',
      foreignKey: 'taskId',
     });
  };
  return Task;
};
