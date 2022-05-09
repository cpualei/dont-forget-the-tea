'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('ListTasks', [
      {
        taskId:'1',
        listId:'1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        taskId:'2',
        listId:'1',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('ListTasks', null, {});
  }
};
