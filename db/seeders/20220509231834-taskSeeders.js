'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Tasks', [{
      content:'go to grocery store',
      dueDate: new Date(),
      userId:'1',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      content:'go home',
      dueDate: new Date(),
      userId:'1',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Tasks', null, {});
  }
};
