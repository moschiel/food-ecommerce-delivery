'use strict';

module.exports = {
  up: async (queryInterface, DataType) => {
    queryInterface.createTable('shopkeeper', {
      id: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: DataType.STRING,
      password: DataType.STRING,
      email: DataType.STRING,
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
