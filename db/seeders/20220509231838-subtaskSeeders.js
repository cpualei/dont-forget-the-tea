'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Subtasks', [
      {
        content:'buy banana',
        taskId:'1',
        userId:'1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        content:'take a nap',
        taskId:'2',
        userId:'1',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Subtasks', null, {});
  }
};
