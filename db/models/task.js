'use strict';
module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
    content: DataTypes.STRING,
    dueDate: DataTypes.DATE,
    userId: DataTypes.INTEGER,
    completed: DataTypes.BOOLEAN
  }, {});
  Task.associate = function(models) {
    // associations can be defined here
    Task.hasMany(models.Subtask, { 
      foreignKey: 'taskId' , 
      onDelete: 'CASCADE', 
      hooks: true 
    });
    Task.hasMany(models.ListTask, { 
      foreignKey: 'taskId',
      onDelete: 'CASCADE', 
      hooks: true  
    })
    Task.belongsTo(models.User, { foreignKey: 'userId' });
    Task.belongsToMany(models.List, {
      through: 'ListTask',
      otherKey: 'listId',
      foreignKey: 'taskId',
     });
  };
  return Task;
};
