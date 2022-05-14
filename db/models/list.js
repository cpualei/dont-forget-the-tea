'use strict';
module.exports = (sequelize, DataTypes) => {
  const List = sequelize.define('List', {
    title: DataTypes.STRING,
    userId: DataTypes.INTEGER,
  }, {});
  List.associate = function(models) {
    List.hasMany(models.ListTask, { 
      foreignKey: 'listId', 
      onDelete: 'CASCADE', 
      hooks: true });
    List.belongsTo(models.User, { foreignKey: 'userId' });
    List.belongsToMany(models.Task, {
      through: 'ListTask',
      otherKey: 'taskId',
      foreignKey: 'listId', 
      onDelete: 'CASCADE', 
      hooks: true 
     });
    
  };
  return List;
};
