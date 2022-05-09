'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      {firstName:'Demo', 
        lastName: 'User', 
        username: 'DemoUser', 
        profilePicURL:'https://tinyurl.com/39nh2xrv',
        email: 'DemoUser@gmail.com',
        hashPassword: '$2a$10$tmIIJV3Gfqe.hBQ4IGVgsOqh3me/hwREZEuYlcnMe6jJCu5LdhzAe',
        createdAt: new Date(),
        updatedAt: new Date()
     }
  ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
