'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      {firstName:'Weiqi', 
      lastName: 'Mei', 
      username: 'WeiqiMei', 
      profilePicURL:'https://tinyurl.com/39nh2xrv',
      email: 'weiqimei@gmail.com',
      hashPassword: 'boba123',
      createdAt: new Date(),
      updatedAt: new Date()
      
    }
  ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
