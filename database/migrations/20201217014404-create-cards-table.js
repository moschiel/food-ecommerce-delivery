'use strict';

module.exports = {
  up: async (queryInterface, DataType) => {
    queryInterface.createTable('cards', {
        id: {
          type: DataType.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        selected: DataType.INTEGER,
        type: DataType.STRING,
        number: DataType.STRING,
        expirationDate: DataType.STRING,
        cvv: DataType.STRING,
        holderName: DataType.STRING,
        holderCpf: DataType.STRING,
        deleted: {
          type: DataType.INTEGER,
          defaultValue: 0
        },
        createdAt: {
          type: DataType.DATE
        },
        updatedAt: {
          type: DataType.DATE
        }
    });
  },

  down: async (queryInterface, DataType) => {
    queryInterface.dropTable('cards');
  }
};
