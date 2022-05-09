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
    List.belongsTo(models.User, { foreignKey: 'userId' });
    List.belongsToMany(models.Task, {
      through: 'ListTask',
      otherKey: 'taskId',
      foreignKey: 'listId',
     });
  };
  return List;
};
