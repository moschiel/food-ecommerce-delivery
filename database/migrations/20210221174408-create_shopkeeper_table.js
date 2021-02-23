'use strict';

module.exports = {
  up: async (queryInterface, DataType) => {
    queryInterface.createTable('shopkeeper', {
      username: DataType.STRING,
      password: DataType.STRING,
      createdAt: {
        type: DataType.DATE
      },
      updatedAt: {
        type: DataType.DATE
      }
  });
  },

  down: async (queryInterface, DataType) => {
    queryInterface.dropTable('shopkeeper');
  }
};
